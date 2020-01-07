module.exports = class {
    constructor() {
        this.curORM = null;
        this.sequelize = null;
        this.sqlData = null;
        this.sqlName = null;
    }

    //插入数据
    async insertData(...args) {
        if (this.sequelize == null || this.curORM == null) {
            console.trace('insertData 未经初始化的调用');
        }
        return await new Promise((resolve) => {
            resolve();
        });
    }

    //更新数据
    async updateData(...args) {
        if (this.sequelize == null || this.curORM == null) {
            console.trace('updateDate 未经初始化的调用');
        }
        return await new Promise((resolve) => {
            resolve();
        });
    }

    //删除数据
    async deleteData(...args) {
        if (this.sequelize == null || this.curORM == null) {
            console.trace('deleteData 未经初始化的调用');
        }
        return await new Promise((resolve) => {
            resolve();
        });
    }

    //获取数据
    async getData(...args) {
        if (this.sequelize == null || this.curORM == null) {
            console.trace('deleteData 未经初始化的调用');
        }
        return await new Promise((resolve) => {
            resolve();
        });
    }

    //
    getOrmInstance(){
        return this.curORM;
    }
    getSqlData(){
        return this.sqlData;
    }
    getSqlName(){
        return this.sqlName;
    }
}
