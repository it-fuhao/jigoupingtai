/**
 * webpack js文件编译、合并打包
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

const path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    webpack = require('webpack-stream').webpack;

const CONF = require('./config.js');

// loader 配置
const getRules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'post',
        use: [
            // js中字符串替换
            {
                loader: "webpack-replace-loader",
                options: {
                    arr: [
                        { search: '__PREFIX__', replace: CONF.PREFIX, attr: 'g' }
                    ]
                }
            },
            {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                }
            },
            'es3ify-loader'
        ]
    },
    {
        test: /\.(html|tpl|ejs)$/,
        exclude: /node_modules/,
        use: [
            // html模板文件
            {
                loader: "webpack-replace-loader",
                options: {
                    arr: [
                        { search: '__PREFIX__', replace: CONF.PREFIX, attr: 'g' }
                    ]
                }
            },
            "html-loader"
        ]
    }
]

/**
 * 获取文件夹下面的所有的文件(包括子文件夹)
 * @param  {String} entPath 入口文件路径规则
 * @param  {String} entDir 入口文件目录
 * @return {Object}
 */
const getEntrys = (entPath, entDir) => {
    const files = glob.sync(entPath),
        res = {};
    files.forEach(file => {
        const arr = file.split('/'),
            pagesKey = arr.indexOf(entDir);
        let name = arr.slice(pagesKey+1 , arr.length-1);
            name = name.length === 0 ? "index" : name.join("/");
        res[name] = path.resolve(file);
    });
    return res;
};
/**
 * 生自定义组件打包使用的数组
 * array
 */
const getCommonChunks = folder => {
    const comps = glob.sync(folder);
    comps.forEach( (file, i) =>{
        comps[i] = path.resolve(file);
    });
    return comps;
}


module.exports = env => {
    const pageSrc = CONF.JAVASCRIPT.ENTRY.SRC,
        pageDir = CONF.JAVASCRIPT.ENTRY.DIR,
        comSrc = CONF.JAVASCRIPT.COMPONENTS.SRC;
        comDir = CONF.JAVASCRIPT.COMPONENTS.DIR;

    let entries = getEntrys(pageSrc, pageDir); //生成入口配置
    let commonChunks = getCommonChunks(comSrc); //组件配置

    //第3方模块
    if (CONF.JAVASCRIPT.VENDOR.length > 0 ) {
        entries.vendor = CONF.JAVASCRIPT.VENDOR;
    };
    // 自定义组件
    if (commonChunks.length > 0 ) {
        entries.common = commonChunks;
    };
    
    return {
        entry: entries,
        output: {
            filename: '[name].js'
        },
        resolve: {
           // 快捷访问 
            alias: {
                // @组件
                '@components': CONF.JAVASCRIPT.COMPONENTS.DIR,
                'san': env === 'production' ? 'san/dist/san.js' : 'san/dist/san.dev.js'
            },
            // 模块搜索目录
            modules: [
                CONF.SRC_DIR,
                path.resolve(process.cwd(), 'node_modules'),
            ],
            // 自动匹配文件后缀顺序
            extensions: ['.js', '.json'],
        },
        // 模块
        module: {
            rules: getRules
        },
        watch: false,
        profile: true,
        cache: true,
        // 插件
        plugins: [
            // 提取公用文件
            new webpack.optimize.CommonsChunkPlugin({
                // 这里的顺序和html里面生成的script 标签顺序有关系
                // 这样生成的script 顺序是  vendor -> common
                names: ['common', 'vendor'], 
            }),
        ]
    }
}