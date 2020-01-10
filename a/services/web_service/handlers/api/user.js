const mysql_service = require('../../../mysql_service/mysql_service');
const interactive_service = require('../../../interactive_service/interactive_service');
const Sequelize = require('sequelize');
const {lt, gt, lte, ne, in: opIn} = Sequelize.Op;

module.exports = {
    //
    async login(ctx, query) {
        let account = query.account;
        let password = query.password;
        //
        let {dataValues} = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_account: account}});
        let ret = dataValues ? [dataValues] : null;
        if (ret == null || ret[0] == null || ret[0]._password != password) {
            return lib.web.returnBody(ctx, '账号或密码错误', 2);
        }
        //登录成功 加入TOKEN
        const token = lib.tool.getToken();
        delete ret[0]._password;
        delete ret[0]._amount_passowrd;
        ret[0]._token = token;
        let account_user = ret[0];
        ctx.session.account = account;
        let clientIP = lib.tool.get_client_ip(ctx);
        let clientTime = lib.tool.cur_date();
        //
        //await mysql_service.account.6update_user_token(ret[0]._user_id, token, clientTime, clientIP);
        await mysql_service.accountOrm['users'].getOrmInstance().update({
            _token: token,
            _login_time: clientTime,
            _login_ip: clientIP
        }, {where: {_account: account}});
        return lib.web.returnBody(ctx, account_user);
    },
    async register(ctx, query) {
        let userid = ctx.request.headers['userid'];
        //
        let account = query.account;
        let password = query.password;
        let email = query.email;
        let name = query.name;
        //下级开户参数
        let registerNextUser = query.next_user;
        let registerNextRole = query.next_role;
        if (registerNextUser) {
            let account_user = await mysql_service.accountOrm['users'].getOrmInstance().findOne({
                where: {
                    _user_id: userid,
                }
            });
            if (account && account_user.dataValues) {
                if (account.dataValues._role < 1) {
                    return lib.web.returnBody(ctx, '您的账号不是代理账号，无法开户下级');
                }

            } else {
                return lib.web.returnBody(ctx, '不存在的用户');
            }
        }
        //
        if (account == null || password == null || email == null || name == null) {
            return lib.web.returnBody(ctx, '信息填写不完整', 6);
        }
        let isAccount = lib.tool.is_account(account);
        if (isAccount) {
            return lib.web.returnBody(ctx, isAccount, 4);
        }
        password = String(password);
        let isPassword = lib.tool.is_password(password);
        if (isPassword) {
            return lib.web.returnBody(ctx, isPassword, 5);
        }
        //let account_user = await mysql_service.6account.get_user_info(null, null, account, email);
        let account_user = await mysql_service.accountOrm['users'].getOrmInstance().findOne({
            where: {
                _account: account,
                _email: email,
            }
        });
        account_user && account_user.dataValues && (account_user.ret = [account_user.dataValues]);
        if (/*account_user.err || */ account_user && account_user.ret && account_user.ret.length) {
            lib.web.returnBody(ctx, '账号或邮箱已存在', 1);
        } else {
            //注册成功提交注册至ROCKET的API
            let result = await interactive_service.restApi.registerUser(account, password, email, name);
            if (result.err != null) {
                console.warn('注册API账号出错 取消注册', result.err);
                //出错要刚入库的老账号
                //await mysql_service.6account.api_failure_delete_user(account);
                await mysql_service.accountOrm['users'].getOrmInstance().destroy({where: {_account: account}});
                //
                return lib.web.returnBody(ctx, '注册API账号出错: ' + result.err);
            }
            //
            //注册 到APP
            let user_id = result.ret.data.user._id;
            // let first_config = await mysql_service.6account.get_new_user_configs();
            let first_config = await mysql_service.accountOrm['users'].getOrmInstance().findOne();
            first_config.ret = [first_config.dataValues];
            let amount = first_config.ret[0]._new_user_amount;
            let clientIP = lib.tool.get_client_ip(ctx);
            let clientTime = lib.tool.cur_date();
            //let reg_res = await mysql_service.6account.register_user(user_id, account, password, name, amount, 0, clientIP, clientTime, email);
            let reg_res = await mysql_service.accountOrm['users'].getOrmInstance().create({
                _user_id: user_id,
                _account: account,
                _password: password,
                _amount_password: password,
                _nickname: account,
                _role: registerNextRole || null,
                _amount: amount,
                _commission: 0,
                _register_ip: clientIP,
                _register_time: clientTime,
                _email: email,
                _status: 0,
            });
            if (reg_res.err) {
                console.warn('注册账号出错', reg_res.err);
                //await mysql_service.6account.api_failure_delete_user(account);
                await mysql_service.accountOrm['users'].getOrmInstance().destroy({where: {_account: account}});
                return lib.web.returnBody(ctx, '注册账号出错');
            }
            if (registerNextUser) {
                await this.bindDealer(ctx, {userid: user_id, bind_next: true});
            } else {
                return lib.web.returnBody(ctx, '成功注册账号 ' + account);
            }
        }
    },
    async home(ctx) {
        return lib.web.returnBody(ctx, '主页');
    },
    async exit(ctx) {
        let userid = ctx.request.headers['userid'];
        //let exitResult = await mysql_service.6account.update_user_token(userid, null);
        let exitResult = await mysql_service.accountOrm['users'].getOrmInstance().update({_token: null}, {where: {_user_id: userid}});
        if (exitResult.err) {
            console.warn('玩家退出登录时 TOKEN清除失败', userid);
        }
        return lib.web.returnBody(ctx, '退出登录成功');
    },
    //绑定银行卡
    async bindBankCard(ctx, query) {
        let {card_number, card_body, card_bank_name} = query;
        let userid = ctx.request.headers['userid'];
        let cur_time = lib.tool.cur_date();
        //let {err, ret} = await mysql_service.6account.add_bank_card_info(userid, card_number, card_body, card_bank_name, cur_time);
        let {err} = await mysql_service.accountOrm['user_bank_cards'].getOrmInstance().create({
            _user_id: userid,
            _card_number: card_number,
            _card_body: card_body,
            _card_bank_name: card_bank_name,
            _time: cur_time,
        });
        if (err) {
            console.error('添加银行卡出错', err);
            return lib.web.returnBody(ctx, '添加失败:' + (isNaN(err) ? '' : ret), 1);
        }
        lib.web.returnBody(ctx, '添加成功');
    },
    //获取银行卡
    async getBankCards(ctx, query) {
        //
        let userid = ctx.request.headers['userid'];
        //let {err, ret} = await mysql_service.6account.get_user_bank_card_list(userid);
        let ret = await mysql_service.accountOrm['user_bank_cards'].getOrmInstance().findAll({where: {_user_id: userid}});
        ret = lib.mysql.getDataValues(ret);
        if (/*err || */!ret) {
            console.error('查询银行卡信息出错', err);
            return lib.web.returnBody(ctx, '获取银行卡信息错误', 1);
        }
        lib.web.returnBody(ctx, ret);
    },
    //更换密码
    async cheatPassword(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {srcPassword, newPassword} = query;
        //
        //let userInfo = await mysql_service.6account.cheatPassword(userid, srcPassword, newPassword);
        let userInfo = await mysql_service.accountOrm['users'].getOrmInstance().update({_password: newPassword}, {
            where: {
                _user_id: userid,
                _password: srcPassword,
            }
        });
        if (!userInfo[0]) {
            return lib.web.returnBody(ctx, '原密码不对或者原密码与新密码相同');
        }
        //修改API
        try {
            let result = await interactive_service.restApi.updateUserInfo(userid, {password: newPassword});
            if (result.err != null) {
                console.warn('修改API密码账号出错 取消', result.err);
                //出错要刚入库的老密码
                //await mysql_service.6account.cheatPassword(userid, newPassword, srcPassword);
                await mysql_service.accountOrm['users'].getOrmInstance().update({_password: srcPassword}, {
                    where: {
                        _user_id: userid,
                        _password: newPassword,
                    }
                });
                //
                return lib.web.returnBody(ctx, '修改密码出错: ' + result.err, 2);
            } else {
                return lib.web.returnBody(ctx, '修改密码成功');
            }
        } catch (e) {
            console.error('修改密码错误', e);
            // await mysql_service.6account.cheatPassword(userid, newPassword, srcPassword);
            await mysql_service.accountOrm['users'].getOrmInstance().update({_password: srcPassword}, {
                where: {
                    _user_id: userid,
                    _password: newPassword,
                }
            });
            return lib.web.returnBody(ctx, '修改密码出错:', 3);
        }
    },
    //更换资金密码
    async cheatAmountPassword(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {srcPassword, newPassword} = query;
        //
        // let cheatRet = await mysql_service.account.cheatAmountPassword(userid, srcPassword, newPassword);
        let cheatRet = await mysql_service.accountOrm['users'].getOrmInstance().update({_amount_password: newPassword}, {
            where: {
                _user_id: userid,
                _amount_password: srcPassword,
            }
        });
        if (!cheatRet[0]) {
            return lib.web.returnBody(ctx, '原密码不对或者新密码与原密码相同');
        }
        return lib.web.returnBody(ctx, '资金密码修改成功');
    },
    //重设密码
    async restPassword(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {amountPassword, newPassword} = query;
        //
        // let userInfo = await mysql_service.6account.get_user_info(null, userid);
        let userInfo = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_user_id: userid}});
        userInfo.ret = [userInfo.dataValues];
        if (userInfo.err || userInfo.ret == null || userInfo.ret[0] == null) {
            return lib.web.returnBody(ctx, '找不到用户', 1);
        }
        if (userInfo.ret[0]._amount_passowrd != amountPassword) {
            return lib.web.returnBody(ctx, '资金密码有误', 2);
        }
        await this.cheatPassword(ctx, {srcPassword: userInfo.ret[0]._password, newPassword: newPassword});
    },
    //获取信息
    async getUserInfo(ctx) {
        let userid = ctx.request.headers['userid'];
        //let {err, ret} = await mysql_service.6account.get_user_info(null, userid);
        let ret = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_user_id: userid}});
        let err = null;
        ret = [ret.dataValues];
        //
        if (err || ret == null || ret[0] == null) {
            return lib.web.returnBody(ctx, '用户不存在', 2);
        }
        delete ret[0]._password;
        delete ret[0]._amount_passowrd;
        delete ret[0]._token;
        return lib.web.returnBody(ctx, ret[0]);
    },
    //添加提现请求
    async addWithdraw(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {card_id, amount, amount_password} = query;
        //检验密码
        // let userResult = await mysql_service.account.get_user_info(null, userid);
        let userResult = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_user_id: userid}});
        userResult.ret = [userResult.dataValues];
        //
        if (userResult.err || userResult.ret == null || userResult.ret[0] == null) {
            return lib.web.returnBody(ctx, '用户不存在', 1);
        }
        if (userResult.ret[0]._amount_passowrd != amount_password) {
            return lib.web.returnBody(ctx, '资金密码不对', 2);
        }
        //卡号
        // let cardResult = await mysql_service.6account.get_user_bank_card_list(userid, card_id);
        let cardResult = await mysql_service.accountOrm['user_bank_cards'].getOrmInstance().findOne({
            where: {
                _user_id: userid,
                id: card_id,
            }
        });
        cardResult.ret = [cardResult.dataValues];

        if (cardResult.err || cardResult.ret == null || cardResult.ret[0] == null) {
            return lib.web.returnBody(ctx, '银行卡不存在', 3);
        }
        if (amount > userResult.ret[0]._amount) {
            return lib.web.returnBody(ctx, '金币不足以提现', 4);
        }
        //获取当前时间戳
        let time = lib.tool.cur_date();
        let {err} = await mysql_service.accountOrm['user_withdraws'].getOrmInstance().create({
            _user_id: userid,
            _bank_card_id: card_id,
            _amount: amount,
            _state: 0,
            _time: time,
        });
        //let {err, ret} = await mysql_service.account.add_withdraw(userid, card_id, amount, time);
        if (err/* || ret == null*/) {
            return lib.web.returnBody(ctx, '提交失败', 5);
        }
        return lib.web.returnBody(ctx, '提现申请已提交');
    },
    //绑定上级代理
    async bindDealer(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {up_id, bind_next} = query;
        //是否是绑定下级
        if (bind_next) {
            [up_id, userid] = [userid, up_id];
        }
        let user_info = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_user_id: up_id}});
        if (!user_info.dataValues) {
            return lib.web.returnBody(ctx, '不存在的上级用户', 1);
        }
        //是否已经绑定
        let ret = await mysql_service.accountOrm['dealers'].getOrmInstance().findOne({where: {_next_id: userid}});
        if (ret && ret.dataValues) {
            return lib.web.returnBody(ctx, '你已经绑定过代理了，不能重复绑定', 3);
        }
        //遍历被绑定的上级的上级层数据
        let retArray = await mysql_service.accountOrm['dealers'].getOrmInstance().findAll({where: {_next_id: up_id}});
        if (!retArray || retArray.length == 0) {
            return lib.web.returnBody(ctx, '被绑定的用户不是代理用户', 2);
        }
        //取所有上级载入+1
        let ary = [{_user_id: up_id, _next_id: userid, _dealer_level: 1}];
        for (let dataObj of retArray) {
            let data = dataObj.dataValues;
            //去重复
            if (data._dealer_level > 0) {
                ary.push({
                    _user_id: data._user_id,
                    _next_id: userid,
                    _dealer_level: data._dealer_level + 1
                });
            }

        }
        //非多余操作
        let aryS = [].concat(ary);
        await mysql_service.accountOrm['dealers'].getOrmInstance().bulkCreate(aryS);
        if (bind_next) {
            return lib.web.returnBody(ctx, '为下级开户成功');
        } else {
            return lib.web.returnBody(ctx, '绑定成功');
        }
    },
    //获取代理
    async getDealers(ctx, query) {
        let userid = ctx.request.headers['userid'];
        //
        let retArray = await mysql_service.accountOrm['dealers'].getOrmInstance().findAll({
            where: {
                _dealer_level: {
                    $lt: 2
                }
            }
        });
        if (!retArray || retArray.length == 0) {
            return lib.web.returnBody(ctx, '无数据', 1);
        }
        //
        lib.mysql.getDealersTree(lib.tool.getObjectArrayInAttributesArray(retArray, 'dataValues'));
        return lib.web.returnBody(ctx, retArray);
    },
    //添加充值记录
    async addRecharge(ctx, query) {
        let userid = ctx.request.headers['userid'];
        let {amount} = query;
        //
        await mysql_service.accountOrm['recharge'].getOrmInstance().create({
            _user_id: userid,
            _amount: amount,
            _state: 0,
            _recharge_time: lib.tool.cur_date(),
        }).catch((err) => {
            console.error('充值失败', err);
            lib.web.returnBody(ctx, '提交充值失败', 1);
        });
        //
        lib.web.returnBody(ctx, '提交充值成功');
    },
    //结算
    async calcRecharges(ctx, query) {
        // let todayRecharges = await mysql_service.accountOrm['recharge'].getOrmInstance().findAll({
        //     order: [['_user_id']]
        // });
        let todayRecharges = await mysql_service.accountOrm.sequelize.query(
                `select _user_id, sum(_amount) as _amount FROM a_recharges GROUP BY _user_id`);
        if (!todayRecharges || !todayRecharges.length) {
            return lib.web.returnBody(ctx, '查询出错', 1);
        }
        let dataValues = todayRecharges[0];
        let retArray = await mysql_service.accountOrm['dealers'].getOrmInstance().findAll({
            where: {
                _dealer_level: {
                    [lt]: 2
                }
            }
        });
        if (!retArray || retArray.length == 0) {
            return lib.web.returnBody(ctx, '无代理关系数据', 2);
        }
        let treeObjects = lib.mysql.getDealersTree(lib.tool.getObjectArrayInAttributesArray(retArray, 'dataValues'));
        //添加充值
        for (let data of dataValues) {
            let treeId = lib.mysql.findUidHasTreeMap(treeObjects, data._user_id);
            let tree = treeObjects[treeId];
            //
            tree.addRechargeAmount(data._user_id, data._amount);
        }
        //获取分润配置
        let sql_configs = await mysql_service.accountOrm['cash_configs'].getOrmInstance().findAll();
        let configs = lib.tool.getObjectArrayInAttributesArray(sql_configs, 'dataValues');
        //开始分润
        for (let treeId in treeObjects) {
            let tree = treeObjects[treeId];
            tree.dividendCommission(configs);
            //写佣金分 TODO:
            for (let uid in tree.info) {
                let userInfo = tree.info[uid];
                if (userInfo.meCommission > 0) {
                    let uUser = await mysql_service.accountOrm['users'].getOrmInstance().findOne({where: {_user_id: uid}});
                    if (uUser) {
                        uUser.increment({_commission: userInfo.meCommission});
                    }
                }
            }
        }
        lib.web.returnBody(ctx, '写分成功');
    }
}
