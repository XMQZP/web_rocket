const sql_info = {
    mysql: {
        //开发
        debug: {
            host: '127.0.0.1',
            user: 'root',
            password: '123456',
            database: 'app_rocket_chat',
            port: 3306,
        },//线上
        run: {
            host: '127.0.0.1',
            user: 'root',
            password: 'Wolf@2019',
            database: 'app_rocket_chat',
            port: 3306,
        }
    }
    // mysql:{
    //     host : "127.0.0.1",
    //     port : "3306",
    //     database : "app_rocket_chat",
    //     user : "root",
    //     password : "Wolf@2019",
    //
    // }
}

module.exports = function (sql_type) {
    if (String(sql_type) || String(RUN_TYPE)) {
        return sql_info[sql_type][RUN_TYPE];
    }
    throw new Error('不支持的数据库类型' + sql_type);
}
