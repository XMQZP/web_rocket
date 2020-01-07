const tool = require('./tool');
const web = require('./web');
const mysql = require('./mysql');
exports.init = function () {
    if (global['lib'] == null) {
        global['lib'] = new Object();
    }else{
        console.warn('全局变量lib被占用或多次赋值');
    }
    //
    lib.tool = tool();
    lib.web = web();
    lib.mysql = mysql();
};
