/**
 * mock 数据模拟
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

const Mock = require("mockjs"),
    path = require("path"),
    glob = require("glob"),
    CONF = require("./config.js");

const mockFiles = glob.sync(path.join(process.cwd(), CONF.MOCK));
let mockConfig = [];

mockFiles.forEach( file => {
    const fileConfig = require(file)(Mock); //加载 mock 配置文件

    if (!fileConfig.handle && !fileConfig.router) {
        return false;
    };

    let item = {
        route : fileConfig.route,
        handle : (req, res, next) => {
            // 数据类型
            let contentType = "";
            switch (fileConfig.dataType) {
                case "json" : 
                    contentType = "application/json;charset=UTF-8";
                    break;
                default : 
                    contentType = 'text/html;charset=utf-8';
            }

            // 文件头
            res.writeHead(200,{
                "Content-type" : contentType
            });
            res.write(JSON.stringify( fileConfig.handle() ));
            //有开头有结尾不然数据依然无返回
            res.end();
        }
    };
    mockConfig.push(item);
});

module.exports = () => {
    return mockConfig;
}