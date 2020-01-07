const rest_api = require('./rocket_rest_api/rest_api');
exports.init = async function () {
    await rest_api.init();
    //
    exports.restApi = rest_api.self;
};
