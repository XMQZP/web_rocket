const mysql = require('./mysql/mysql');
const sequelize_ORM = require('./orm/sequelizeORM');
const sqlConfig = require('../../configs/sql_config');
let sqlAccount = require('./content/sql_account');

async function promiseBackCall(sql, args) {
    return new Promise((resolve, reject) => {
        if (mysql._init_ed_) {
            mysql.query(sql, args, (err, ret) => {
                if (err) {
                    console.error('数据库错误语句', sql, args, err);
                }
                resolve({err, ret});
            });
        } else {
            resolve({err: new Error('数据库未初始化'), ret: null});
        }
    });
}

async function promiseErrorBackCall(errCode = 1, errMessage = '未知错误', log = null) {
    return new Promise((resolve, reject) => {
        console.warn('数据库Promise警告', errCode, errMessage, log);
        resolve({err: errCode, ret: errMessage});
    });
}

exports.init = async function () {
    // mysql.init(sqlConfig('mysql', RUN_TYPE));
    // mysql._init_ed_ = true;
    //
    exports.accountOrm = new sequelize_ORM();
    //加载内容
    // exports.account = new sqlAccount(promiseBackCall, promiseErrorBackCall);
}

