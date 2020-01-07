const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class c extends Interface {
    constructor(sequelize) {
        super();
        this.sqlName = 'a_user_bank_cards';
        this.sequelize = sequelize;
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _user_id: Sequelize.STRING(32),  //用户ID
            _card_number: Sequelize.STRING(32),
            _card_body: Sequelize.STRING(32),
            _card_bank_name: Sequelize.STRING(32),
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
