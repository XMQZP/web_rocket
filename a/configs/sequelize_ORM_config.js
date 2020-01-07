module.exports = {
    mysql: {
        debug: {
            data_name: 'app_rocket_chat',
            data_user: 'root', data_password: '123456', host: '127.0.0.1', port: 3306,
            dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        run: {
            data_name: 'app_rocket_chat', data_user: 'root', data_password: '123456', host: '127.0.0.1', port: 3306,
            dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
    }
};
