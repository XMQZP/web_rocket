const log4js = require('log4js');
const log4jsConfig =require('../../configs/log4js_config');
module.exports = {
    init: function (category = 'default') {
        let log4 = log4jsConfig(SERVER_TYPE);
        // noinspection JSCheckFunctionSignatures
        log4js.configure(log4);
        const logger = log4js.getLogger(category);
        log4.consoleLogChange(logger);
    }
};
