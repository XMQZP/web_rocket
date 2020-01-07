const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class c extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.sqlName = 'a_cash_configs';
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _amount: Sequelize.BIGINT,  //充值
            _cash_back: Sequelize.BIGINT,  //返利
        };
        //
        this.curORM = sequelize.define(this.sqlName, this.sqlData, {
            timestamps: false
        });
    }

    //
}

module.exports = c;
