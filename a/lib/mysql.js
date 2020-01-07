//双向链表节点
class doubleLink {
    constructor(id, up, level) {
        this.id = id;
        this.up = up;
        this.down = [];
        this.level = level;
        //个人、团队充值
        this.meCharge = 0;
        this.teamCharge = 0;
        //个人、团队持润
        this.meCommission = 0;
        this.teamCommission = 0;
    }
}

//双向链表
class structDoubleLink {
    constructor(id = null) {
        this.head = null;
        this.info = {};
        //
        if (id) {
            this.addNode(id, 0, null, null,);
        }
    }

    //添加链表节点
    addNode(id, level, upId) {
        if (this.getNode(id)) {
            console.debug(id, '已存在');
        }
        if (level == 0) {
            this.head = new doubleLink(id, null, level);
            this.info[id] = this.head;
            return this.info[id];
        }
        let up = this.info[upId];
        this.info[id] = new doubleLink(id, up, level);
        //双向检验
        if (up) {
            up.down.push(this.info[id]);
        }
    }

    //获取节点
    getNode(id) {
        return this.info[id];
    }

    //添加充值
    addRechargeAmount(id, amount) {
        let info = this.getNode(id);
        if (info == null) {
            throw new Error('不存在的ID');
        }
        let amountI = Number(amount);
        if (isNaN(amountI)) {
            throw new Error('非法的充值值' + amount);
        }
        //
        info.meCharge += amountI;
        let up = info.up;
        while (up) {
            up.teamCharge += amountI;
            up = up.up;
        }
    }

    //自己吃自充分润
    meEat(node, configs) {
        let nodeCommissionValue = this.getCommissionValue(configs, node.meCharge);
        node.meCommission += nodeCommissionValue;
    }

    //下级团吃
    nextDownEat(node, configs) {
        //没有下级团了
        if (node.down == null || node.down.length == 0) {
            return;
        }
        //下级团吃扣
        for (let down of node.down) {
            //此操作与外层递归处【新四步 1】获取在子层存在重复获取 可以选择性优化
            let downCommissionValue = this.getCommissionValue(configs, down.teamCharge);
            node.teamCommission -= downCommissionValue;
        }
    }

    //剩余团吃
    lastEat(node) {
        node.meCommission += node.teamCommission;
        node.teamCommission = 0;
    }

    //递归
    recursiveCommission(node, configs) {
        //新四步
        //1获取团队分润
        node.teamCommission = this.getCommissionValue(configs, node.teamCharge);
        //2自己 分润
        this.meEat(node, configs);
        //3团 下级分润
        this.nextDownEat(node, configs);
        //4团 剩余全收
        this.lastEat(node);
        //下级重复此操作
        if(node.down.length > 0){
            for(let down of node.down){
                this.recursiveCommission(down, configs);
            }
        }
    }

    //开始分润
    dividendCommission(configs) {
        let info = this.head;
        //递归分润
        this.recursiveCommission(info, configs);
    }

    //获取分润值
    getCommissionValue(configs, amount) {
        let value = 0;
        for (let i = 0; i < configs.length; i++) {
            if (amount < configs[i]._amount) {
                return value;
            }
            value = configs[i]._cash_back;
        }
        return value;
    }
}

module.exports = function () {
    let mysql = {
        getDataValues: function (sqlRetArray) {
            if (!sqlRetArray) return null;
            let args = [];
            for (let ret of sqlRetArray) {
                args.push(ret.dataValues);
            }
            return args;
        },
        findUidHasTreeMap: function (treeMap, id) {
            for (let key in treeMap) {
                if (treeMap[key].getNode(id)) {
                    return key;
                }
            }
        },
        //
        getDealersTree: function (sql_array) {
            let treeStruckDoubleLinkMap = {};
            //开始布树
            for (let obj of sql_array) {
                let uid = obj._user_id;
                let nid = obj._next_id;
                let level = obj._dealer_level;
                //此树只收分叉枝
                if (level > 1) {
                    //直属树
                    continue;
                }
                //是顶点树干
                if (level == 0/* && uid == nid*/) {
                    treeStruckDoubleLinkMap[uid] = new structDoubleLink(uid);
                } else if (level == 1) {
                    //上级是顶点树干
                    if (treeStruckDoubleLinkMap[uid]) {
                        treeStruckDoubleLinkMap[uid].addNode(nid, level, uid);
                    } else {
                        //上级不是顶点树干 就根据上级找所在哪颗树
                        let id = this.findUidHasTreeMap(treeStruckDoubleLinkMap, uid);
                        treeStruckDoubleLinkMap[id].addNode(nid, level, uid);
                    }
                }
            }
            // console.log('布树完毕', treeStruckDoubleLinkMap);
            return treeStruckDoubleLinkMap;
        },
        arrayToInString: function (array) {
            if (!array) return '()';
            let reString = '(';
            for (let i = 0; i < array.length; i++) {
                let ina = array[i];
                if (typeof ina === 'string') {
                    reString += `'${ina}'`;
                } else {
                    reString += `${ina}`;
                }
                if (i < array.length - 1) {
                    reString += ','
                }
            }
            reString += ')';
            //
            return reString
        }
    }

    return mysql;
}
