// NPM Dependencies
const axios = require('axios');
const { filter } = require('rxjs/operators');

// Local Depdendencies
const logger = require('./logger');
const { version } = require('../package.json');

const AARE_API_URL = 'https://aaremarzili-api.herokuapp.com/rest/open/wasserdatencurrent';
const AARE_ORIGIN_URL = 'https://aaremarzili.ch/';
const AARE_RIVER_NAME = 'AAREMARZILIBERN';

let defaults = {};

module.exports = class AareModule {
	/**
	 * @param {ClientWrapper} client
	 * @param {object} options
	 */
	constructor(client, options) {
		/** @type {object} */
		this.settings = { ...defaults, ...options };
		/** @type {string} */
		this.version = version;

		//  ____  _
		// / ___|| |_ _ __ ___  __ _ _ __ ___  ___
		// \___ \| __| '__/ _ \/ _` | '_ ` _ \/ __|
		//  ___) | |_| | |  __/ (_| | | | | | \__ \
		// |____/ \__|_|  \___|\__,_|_| |_| |_|___/
		//

		let aare$ = client.raw$.pipe(
			filter(message => message.command === 'PRIVMSG'),
			filter(message => message.args[1].startsWith('!aare'))
		);

		//  ____        _                   _       _   _
		// / ___| _   _| |__  ___  ___ _ __(_)_ __ | |_(_) ___  _ __  ___
		// \___ \| | | | '_ \/ __|/ __| '__| | '_ \| __| |/ _ \| '_ \/ __|
		//  ___) | |_| | |_) \__ \ (__| |  | | |_) | |_| | (_) | | | \__ \
		// |____/ \__,_|_.__/|___/\___|_|  |_| .__/ \__|_|\___/|_| |_|___/
		//                                   |_|
		//

		aare$.subscribe(async message => {
			let target = message.args[0];

			try {
				let response = await axios({
					url: AARE_API_URL,
					headers: {
						'Origin': AARE_ORIGIN_URL,
						'X-River': AARE_RIVER_NAME,
					},
				});

				let temp_current = response.data.t;
				let temp_future = response.data.tf;
				let prediction;

				if (temp_future > 0) {
					prediction = 'wird schins wermer';
				} else if (temp_future < 0) {
					prediction = 'wird schins cheuter';
				} else {
					prediction = 'blibt schins glich';
				}

				let sentence = `D'aare isch im Momänt öppe ${temp_current}° warm u si ${prediction}.`;

				logger.info(`${temp_current}° (${temp_future})`);

				client.tell(target, sentence);
			} catch (error) {
				logger.error(error.message);

				client.tell(target, `Error: ${error.message}`);
			}
		});
	}
};
