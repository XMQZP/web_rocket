//
const httpHandlersClass = require('./route_map');

module.exports = function (router) {
    //
    router.post('/api', async ctx => {
        let api_path = ctx.request.headers['api-path'];
        let params = ctx.request.body;
        if (ctx.request.method == 'GET') {
            params = ctx.request.req;
        }

        //
        let apiPathAry = api_path.split('.');
        apiPathAry.splice(0,1);
        console.debug('路由路径', api_path);
        try {
            let api = httpHandlersClass;
            let call = api;
            for (let path of apiPathAry) {
                call = api;
                api = api[path];
            }
            return await api.call(call, ctx, params);
        } catch (e) {
            console.error('执行出错 47', e.stack);
            return await lib.web.returnBody(ctx, '非法路径', 2);
        }
        //
    });
};
