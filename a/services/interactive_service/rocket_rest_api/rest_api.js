const axios = require('axios');
const rest_api_config = require('../../../configs/rest_api_config');
const {url, admin_user, admin_password, api_user:curUserId, api_token:curToken} = rest_api_config[RUN_TYPE];

//
let rest_api = class {
    constructor() {
        this.X_Auth_Token = curToken;
        this.X_User_Id = curUserId;
    }

    async onInit() {
        try {
            if(this.X_Auth_Token != null && this.X_User_Id != null){
                console.log('API 手动配置 userid and token:', this.X_User_Id, '|', this.X_Auth_Token);
            }else{
                console.log('API 登录中……');
                let result = await this.loginAdmin();
                if (result.status != 200 || result.data == null || result.data.status != 'success') {
                    console.warn('API 登录失败', '参数:', url, admin_user, admin_password, '结果:', result);
                } else {
                    console.log('API 登录成功');
                    let ret = result.data.data;
                    this.X_Auth_Token = ret.authToken;
                    this.X_User_Id = ret.userId;
                }
            }

            return await new Promise((resolve, reject) => {
                resolve();
            });
        } catch (e) {
            console.error('登录API请求错误', e.errno || e);
        }
    }

    //获取用户信息
    async getUserInfo(userName) {
        return axios.get(`${url}/api/v1/users.info?username=${userName}`);
    }

    //修改用户信息
    async updateUserInfo(userId, newInfo) {
        //
        try {
            let data = {userId: userId};
            data.data = newInfo;
            let result = await axios.post(`${url}/api/v1/users.update`, data, {
                headers: {
                    'X-Auth-Token': this.X_Auth_Token,
                    'X-User-Id': this.X_User_Id,
                }
            });
            //
            if (result.statusText != 'OK') {
                console.warn('API 修改用户数据失败 参数:', arguments, '结果:', result);
                return await new Promise((resolve, reject) => {
                    resolve({err: `API ERROR${result.message}`, ret: null});
                });
            } else {
                return await new Promise((resolve, reject) => {
                    resolve({err: null, ret: result});
                });
            }
        } catch (e) {
            console.warn('API 修改用户数据失败', e.response.data.error);
            return await new Promise((resolve, reject) => {
                resolve({err: e.response.data.error, ret: null});
            });
        }
    }

    //登录
    async loginAdmin() {
        //
        return axios.post(`${url}/api/v1/login`, {
            user: admin_user,
            password: admin_password,
        });
    }

    async registerUser(username, password, email = null, name = null) {
        name = name || username;
        email = email || lib.tool.getRandEmail();
        try {
            let result = await axios.post(`${url}/api/v1/users.create`, {
                name: name,
                email: email,
                password: password,
                username: username,
            }, {
                headers: {
                    'X-Auth-Token': this.X_Auth_Token,
                    'X-User-Id': this.X_User_Id,
                    // 'Content-Type': 'application/json',
                }
            });
            //
            if (result.statusText != 'OK') {
                console.warn('API 注册失败 参数:', username, password, email, '结果:', result);
                return await new Promise((resolve, reject) => {
                    resolve({err: `API ERROR${result.message}`, ret: null});
                });
            } else {
                return await new Promise((resolve, reject) => {
                    resolve({err: null, ret: result});
                });
            }
        } catch (e) {
            console.warn('API注册失败', e.response.data.error);
            return await new Promise((resolve, reject) => {
                resolve({err: e.response.data.error, ret: null});
            });
        }
    };
}

//
module.exports = rest_api;
rest_api.self = null;
rest_api.init = async function () {
    rest_api.self = new rest_api();
    await rest_api.self.onInit();
};
