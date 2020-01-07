const sql_service = require('../mysql_service/mysql_service');
let message_count = 0;

async function verification_token(user_id, token) {
    //
    return new Promise(async (resolve) => {
        if (user_id == null) {
            console.warn('未发送userId的请求');
            return resolve(false);
        }
        //let {err, ret} = await sql_service.account.get_user_token(user_id, token);
        let err = null;
        let ret = await sql_service.accountOrm['users'].getOrmInstance().findOne({
            where: {
                _user_id: user_id,
                _token: token
            }
        });
        ret = [ret.dataValues];
        if (err || ret == null || ret[0] == null || ret[0]._token == null || ret[0]._token != token) {
            return resolve(false);
        }
        resolve(true);
    });
    //
}

module.exports = async function (ctx, next) {
    //ignore favicon
    if (ctx.path === '/favicon.ico') return;
    //条件
    if (ctx.request.headers['api-path'] != 'api.user.login' &&
        ctx.request.headers['api-path'] != 'api.user.register') {
        if (await verification_token(ctx.request.headers['userid'], ctx.request.headers['token']) == false) {
            console.warn('无效请求');
            lib.web.returnBody(ctx, '会话过期 请重新登录', 999);
            return;
        }
    }
//
    let str = ctx.request.url;
    let cur_mc = ++message_count;
    console.log(`[req:${cur_mc}] 开始响应:`, str);
    let d = Date.now();
    await next();
    console.log(`[req:${cur_mc}] 结束响应:`, str, '耗时:', Date.now() - d, '毫秒');
}
