//demo koa web service
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const session = require('koa-session');
//用户自定义中间件
const middleWare = require('./auth_middleware');
//用户配置
const {keys, session_config, port} = require('../../configs/web_config');
//API
const api_account = require('./handlers/api_account');

//web 服务
class web_service {
    constructor() {
        //
        const app = new Koa();
        const router = Router();

        //跨域访问组件 可配置
        app.use(cors());
        //会话配置
        app.keys = [].concat(keys);
        app.use(session(session_config, app));
        //用户中间件
        app.use(middleWare);
        //使用ctx.body解析中间件
        app.use(bodyParser());
        //路由组件 理应放最后
        app.use(router.routes());
        app.use(router.allowedMethods());

        //账号API
        api_account(router);
        //

        //请求
        app.on('error', (err, ctx) => {
            console.error('web service 错误', ctx, err.stack);
        });
        app.listen(port[SERVER_TYPE]);

        console.log('监听端口:', port[SERVER_TYPE]);
        //APP
        this.app = app;
        web_service.self = this;
    }
}

web_service.self = null;
web_service.getInstance = function () {
    return web_service.self;
};
web_service.init = function () {
    return new web_service();
};

module.exports = web_service;
