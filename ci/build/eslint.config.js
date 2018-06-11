/**
 * js 代码检测配置
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

module.exports = {
    "parserOptions" : {
        "ecmaVersion": 6 //指定ECMAScript支持的版本，6为ES6
    },
    "rules": {
        //Javascript code 默认校验
        "eqeqeq": "off", //off = 0
        "curly": "error", //error = 2
        "quotes": ["warn", "double"], //warn = 1
    }
}