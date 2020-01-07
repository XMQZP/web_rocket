let fs = require('fs');
const Sequelize = require('sequelize');
const config = require('../../../configs/sequelize_ORM_config').mysql[RUN_TYPE];

module.exports = class {
    constructor() {
        // Option 1: Passing parameters separately
        this.sequelize = new Sequelize(
            config.data_name,
            config.data_user,
            config.data_password,
            config,
        );
        //加载模块
        let files = fs.readdirSync(__dirname + '/models');
        let js_files = files.filter((f)=>{
            return f.endsWith('.js');
        }, files);
        module.exports = {};
        for (let f of js_files) {
            console.log(`加载模块 ${f}`);
            let name = f.substring(0, f.length - 3);
            const model = require(__dirname + '/models/' + f);
            this[name] = new model(this.sequelize);
        }
    }
};
