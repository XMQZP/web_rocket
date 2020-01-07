module.exports = {
    keys: ['7E24107E2C629C2E83AA049F7CA1F173'],
    session_config: {
        key: 'koa:sess',            // 返给浏览器 cookie 的key 默认是 'kao:sess'
        maxAge: 7 * 86400000,       // cookie的过期时间 maxAge in ms (default is 1 days)
        autoCommit: true,           // (boolean) 自动给客户端下发cookie 并设置session
        overwrite: true,            // 是否可以覆盖之前同名的cookie    (默认default true)
        httpOnly: true,             // cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true,               // 签名默认true
        rolling: false,             // 在每次响应时强制设置session标识符cookie，到期时被重置设置过期倒计时。（默认为false）
        renew: false,               // 当session快过期时更新session，这样就可以始终保持用户登录 默认是false
    },
    port: {
        app: 3887,
        login: 3887,
        web: 3888,
    },
}
