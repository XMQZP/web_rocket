//
module.exports = class {
    constructor(promiseBackCall, promiseErrorCall) {
        //引用
        this.promise = promiseBackCall;
        this.promiseError = promiseErrorCall;
    }

    //获取新用户配置
    async get_new_user_configs() {
        let sql = `select * from b_a_config_items`;
        return this.promise(sql, null);
    }

    async add_user_dealer(user_id, dealer_type, superior) {
        let args = [user_id, dealer_type, superior];
        //缺一不可
        if (user_id == null || dealer_type == null) {
            return this.promiseError(52, '玩家代理信息填写不完整', arguments);
        }
        let sql = `insert into a_dealers (_user_id, _dealer_type, _superior) values (?,?,?)`;
        //
        return this.promise(sql, args);
    }

    //注册用户
    async register_user(user_id, account, password, nickname, amount, commission, register_ip, register_time, email) {
        //资金密码首次使用登录密码
        let amount_password = password;
        let args = [user_id, account, password, amount_password, nickname, amount, commission, register_ip, register_time, 0, email];
        if (args.includes(null) || args.includes(undefined)) {
            return this.promiseError(13, '参数错误', args);
        }
        let sql = `insert into a_users(_user_id, _account, _password, _amount_passowrd, _nickname, _amount, _commission, _register_ip, _register_time, _status, _email) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        return this.promise(sql, args);
    }

    //注册API删除用户
    async api_failure_delete_user(account) {
        if (account == null) {
            return this.promiseError(14, '参数错误', args);
        }
        let sql = `delete from a_users where _account = ?`;
        let args = [account];
        return this.promise(sql, args);
    }

    //获取用户信息 * from id or user_id or account
    async get_user_info(id, user_id, account, email) {
        let sql = `select * from a_users `;
        let args = [];
        if (id) {
            sql += `where id = ?`;
            args = [id];
        } else if (user_id) {
            sql += `where _user_id = ?`;
            args = [user_id];
        } else if (account) {
            sql += `where _account = ?`;
            args = [account];
        }
        //和上面可同时传
        if (email) {
            if (args.length == 0) {
                sql = `where _email = ?`;
                args = [email];
            } else {
                sql += `or _email = ?`;
                args.push(email);
            }
        }
        return this.promise(sql, args);
    }

    //获取TOKEN
    async get_user_token(user_id, token) {
        if (user_id == null) {
            return this.promiseError(52, '获取TOKEN错误', arguments);
        }
        let sql = `select _token as token from a_users where _user_id = ?`;
        let args = [user_id];
        return this.promise(sql, args);
    }

    //修改密码
    async cheatPassword(user_id, srcPassword, newPassword) {
        if (user_id == null || srcPassword == null || newPassword == null) {
            return this.promiseError(52, '修改密码userid错误', arguments);
        }
        let sql = `update a_users set _password = ? where _user_id = ? and _password = ?`;
        let args = [newPassword, user_id, srcPassword];
        return this.promise(sql, args);
    }

    //修改资金密码
    async cheatAmountPassword(user_id, srcPassword, newPassword) {
        if (user_id == null || srcPassword == null || newPassword == null) {
            return this.promiseError(52, '修改资金密码userid错误', arguments);
        }
        let sql = `update a_users set _amount_passowrd = ? where _user_id = ? and _amount_passowrd = ?`;
        let args = [newPassword, user_id, srcPassword];
        return this.promise(sql, args);
    }

    //获取银行卡列表
    async get_user_bank_card_list(user_id, card_id = null) {
        if (user_id == null) {
            return this.promiseError(52, '更新TOKEN错误', arguments);
        }
        let sql = `select * from a_user_bank_cards where _user_id = ?`;
        let args = [user_id];
        if (card_id) {
            sql += ` and id = ?`;
            args.push(card_id);
        }
        return this.promise(sql, args);
    }

    //
    async add_withdraw(userid, card_id, amount, time) {
        let args = [userid, card_id, amount, time];
        //缺一不可
        if (args.includes(null) || args.includes(undefined)) {
            return this.promiseError(52, '提现信息填写不完整', arguments);
        }
        let sql = `insert into a_b_user_withdraw(_user_id, _bank_card_id, _amount, _time) values(?,?,?,?)`;
        return this.promise(sql, args);
    }

    //添加银行卡
    async add_bank_card_info(user_id, card_number, card_body, card_bank_name, time) {
        let args = [user_id, card_number, card_body, card_bank_name, time];
        //缺一不可
        if (args.includes(null) || args.includes(undefined)) {
            return this.promiseError(52, '银行卡信息填写不完整', arguments);
        }
        let sql = `insert into a_user_bank_cards(_user_id, _card_number, _card_body, _card_bank_name, _time) values(?,?,?,?,?)`;
        return this.promise(sql, args);
    }

    //更新TOKEN
    async update_user_token(user_id, token, login_time, login_ip) {
        if (user_id == null) {
            return this.promiseError(52, '更新TOKEN错误', arguments);
        }
        let sql = `update a_users set _token = ?, _login_time = ?, _login_ip = ? where _user_id = ?`;
        let args = [token, login_time, login_ip, user_id];
        return this.promise(sql, args);
    }
}
