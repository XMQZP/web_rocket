'use strict'
const help_line = '\n------------------------------------------------------------------------------------\n';
const SERVER_TYPE = process.argv[2] || 'app';
const RUN_TYPE = process.argv[3] || 'debug';
global['SERVER_TYPE'] = SERVER_TYPE;
global['RUN_TYPE'] = RUN_TYPE;

//子进程集群
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

//库方法
const lib = require('../lib/init');
//WEB服务
const web_service = require('../services/web_service/web_service');
//MYSQL服务
const sql_service = require('../services/mysql_service/mysql_service');
//LOG服务
const log_service = require('../services/log_service/log');
//交互服务
const interactive_service = require('../services/interactive_service/interactive_service');

//
async function main() {
    //
    let startT = Date.now();
    //
    console.log('启动 log service');
    log_service.init();
    console.log('log service 已启动', Date.now() - startT, 'ms [', startT = Date.now(), ']', help_line);

    if (false && cluster.isMaster) {
        console.log(`主进程 ${process.pid} 运行中`);
        // 衍生工作进程。
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`工作进程 ${worker.process.pid} 已退出`);
        });
    } else {
        // 工作进程可以共享任何 TCP 连接。
        console.log(`工作进程 ${process.pid} 启动中`);

        console.log('启动 自定义库');
        lib.init();
        console.log('自定义库 已启动', Date.now() - startT, 'ms [', startT = Date.now(), ']', help_line);

        console.log('启动 sql service...');
        await sql_service.init();
        console.log('sql service 已启动', Date.now() - startT, 'ms [', startT = Date.now(), ']', help_line);

        console.log('启动 interactive service...');
        await interactive_service.init();
        console.log('interactive service 已启动', Date.now() - startT, 'ms [', startT = Date.now(), ']', help_line);

        console.log('启动 web service...');
        web_service.init();
        console.log('web service 已启动', Date.now() - startT, 'ms [', startT = Date.now(), ']', help_line);
    }
    //
    return Promise.resolve();
};

const t = Date.now();
console.log(SERVER_TYPE, '|', RUN_TYPE, ' - 服务器启动中……');
main().then(async () => {
    console.log(SERVER_TYPE, '|', RUN_TYPE, ' - 服务器启动完成, 耗时', Date.now() - t, '毫秒');
    //全局吃掉未处理异常
    process.on('uncaughtException', function (err) {
        console.error('未捕获的异常: ' + err.stack);
    });

}).catch((e) => {
    console.log(SERVER_TYPE, '|', RUN_TYPE, ' - 服务器启动失败', e);
});


