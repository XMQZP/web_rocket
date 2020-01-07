////内部方法
//三目运算 ? : 简写
function n_is_a_to_b(n, a ,b){
    return n == a ? b : n;
}

const token_char = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

module.exports = function(){
    ////固定属性
    let tool = {
        //统一时间戳单位
        cur_date: function () {
            return Date.now();
        },
        //随机USERID
        rand_user_id: function (USER_ID_LENGTH = 10) {
            //头一个数不为0 剔除4 改为8
            let user_id = n_is_a_to_b(Math.floor(Math.random() * 9) + 1, 4, 8);
            for (let i = 1; i < USER_ID_LENGTH; i++) {
                user_id *= 10;
                user_id += n_is_a_to_b(Math.floor(Math.random() * 10) + 0, 4, 8);
            }
            return user_id;
        },
        //用户名校验
        is_account:function (account) {
            if(account == null) return '账号不能为空';
        },
        //密码校验
        is_password:function (password) {
            if(password == null || password.length < 5) return '密码长度最少为5';
        },
        //获取请求客户端IP
        get_client_ip:function (ctx) {
            let req = ctx.req;
            let clientIP = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            let ary = clientIP.split(':');
            clientIP = ary[ary.length-1];
            //
            return clientIP;
        },
        //随机TOKEN
        getToken(LEN = 32){
            let cu = null;
            let token = '';
            for(let i = 0; i < LEN; i++){
                cu = Math.floor(Math.random()*token_char.length);
                token += token_char[cu];
            }
            return token;
        },
        //随机邮箱
        getRandEmail(){
            return `${Math.floor(Math.random() * 1e9)}@${Math.floor(Math.random() * 1e5)}.com`;
        },
        //取对象数组中的对象属性数组
        getObjectArrayInAttributesArray(objArray, attributesName, retArray = null){
            retArray || (retArray = []);
            for(let o of objArray){
                retArray.push(o[attributesName]);
            }
            return retArray;
        },
    };

    return tool;
};
