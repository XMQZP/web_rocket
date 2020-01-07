const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class users extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        //表结构
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _user_id: Sequelize.STRING(32),  //用户ID
            _gid: {                             //分组ID
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _mobile: {                               //手机号
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _account: Sequelize.STRING(32),  //账号
            _password: Sequelize.STRING(32),  //
            _amount_password: Sequelize.STRING(32),  //
            _nickname: Sequelize.STRING(64),  //
            _amount: Sequelize.BIGINT,  //               本金
            _commission: Sequelize.BIGINT,  //           佣金
            _role: {                               //
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _token: {                               //
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            _wechat: {                               //
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            _qq: {                               //
                type: Sequelize.STRING(32),
                allowNull: true,
            },
            _email: {                               //
                type: Sequelize.STRING(128),
                allowNull: true,
            },
            _avatar: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            _gender: {                          //性别
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _birth: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            _address: {                         //联系地址
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            _register_ip: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            _login_ip: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            _register_time: Sequelize.BIGINT,
            _login_time: {
                type: Sequelize.BIGINT,
                allowNull: true,
            },
            _status: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        }
        //
        this.curORM = sequelize.define('a_users', this.sqlData, {
            timestamps: false
        });
    }
}

module.exports = users;
