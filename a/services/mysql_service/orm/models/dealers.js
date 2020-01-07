const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class dealers extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        this.sqlData = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            _user_id: Sequelize.STRING(32),  //上级用户ID
            _next_id: Sequelize.STRING(32),//下级用户ID
            _dealer_level: Sequelize.INTEGER,       //级差
        };
        //
        this.curORM = sequelize.define('a_dealers', this.sqlData, {
            timestamps: false
        });
    }

    //
}

module.exports = dealers;
