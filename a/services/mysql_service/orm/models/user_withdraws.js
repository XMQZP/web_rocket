const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class c extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.sqlName = 'a_user_bank_cards';
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _user_id: Sequelize.STRING(32),  //用户ID
            _bank_card_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _amount: Sequelize.BIGINT,
            _state: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _schedule: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            _time: Sequelize.BIGINT,
        };
        //
        this.curORM = sequelize.define(this.sqlName, this.sqlData, {
            timestamps: false
        });
    }

    //
}

module.exports = c;
