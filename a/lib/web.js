////方法
module.exports = function () {
    let web = {
        returnBody: function (ctx, body, code = 0) {
            let return_body = {code: code};
            return_body.data = body;
            ctx.body = return_body;
            if (code) {
                console.debug('未知', body, code);
            }
        }
    };

    return web;
};
