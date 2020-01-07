const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class c extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.sqlName = 'a_recharges';
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _user_id: Sequelize.STRING(32),  //用户ID
            _amount: Sequelize.BIGINT,  //用户ID
            _state: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _recharge_time: Sequelize.BIGINT,
            _update_time: Sequelize.BIGINT,
        };
        //
        this.curORM = sequelize.define(this.sqlName, this.sqlData, {
            timestamps: false
        });
    }

    //
}

module.exports = c;
