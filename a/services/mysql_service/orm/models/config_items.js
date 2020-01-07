const Sequelize = require('sequelize');
const Interface = require('./interface');

//
class b_a_config_item extends Interface {
    constructor(sequelize) {
        super();
        this.sequelize = sequelize;
        //
        this.curORM = sequelize.define('a_config_items', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            //首次注册赠送金币
            _new_user_amount: Sequelize.BIGINT,
        }, {
            timestamps: false
        });
    }

    //
    async insertData(_new_user_amount) {
        await super.insertData();
        await this.curORM.create({_new_user_amount});
    }

    //
    async updateData(_new_user_amount) {
        await super.updateData();
        await this.curORM.update({_new_user_amount}, {where: {}});
    }

    //
    async getData() {
        await super.getData();
        return new Promise((resolve) => {
            this.curORM.findOne().then((ret) => {
                resolve({err: null, ret: ret.dataValues._new_user_amount});
            }).catch((err) => {
                console.error(err);
                throw new Error(`${__filename}获取数据错误:`);
            });
        })
    }
}

module.exports = b_a_config_item;
