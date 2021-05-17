// NPM Dependencies
const debug = require('debug');

//  _
// | |    ___   __ _  __ _  ___ _ __
// | |   / _ \ / _` |/ _` |/ _ \ '__|
// | |__| (_) | (_| | (_| |  __/ |
// |_____\___/ \__, |\__, |\___|_|
//             |___/ |___/
//

let logger = module.exports = {
	debug: debug('rx-irc:bot:aare:debug'),
	log:   debug('rx-irc:bot:aare:log'),
	info:  debug('rx-irc:bot:aare:info'),
	warn:  debug('rx-irc:bot:aare:warn'),
	error: debug('rx-irc:bot:aare:error'),
};

for (let key in logger) {
	logger[key].log = console[key].bind(console);
}
