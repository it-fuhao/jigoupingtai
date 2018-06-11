/**
 * 项目配置
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

const path = require('path'),
    SRC_DIR = 'src/',
    STATIC = 'dist/static/',
    DIST_DIR = 'dist/';

module.exports = {
    // 端口号
    PORT: 8080,
    SRC_DIR: SRC_DIR,
    DIST_DIR: DIST_DIR,
    // api数据模拟
    MOCK: 'api/*.js',
    // css组件前缀
    PREFIX: "ui-",
    // CDN域
    CDN_URL : {
        DEV: "../",
        PROD: "../"
    },

    // 页面
    HTML: {
        SRC: SRC_DIR + 'pages/**/*.html',
        DIST: DIST_DIR
    },

    // 静态资源
    ASSETS: {
        SRC: SRC_DIR + 'assets/**/*',
        DIST: STATIC + 'assets'
    },

    // 图片
    IMAGES: {
        SRC: SRC_DIR + 'images/**/*.?(png|jpg|gif|svg)',
        DIST: STATIC + 'images'
    },

    // 字体
    FONT: {
        SRC: SRC_DIR + 'font/**/*',
        DIST: STATIC + 'font'
    },

    // 样式
    LESS: {
        SRC: SRC_DIR + 'less/pages/*.less',
        DIST: STATIC + 'css',
        ALL: SRC_DIR + 'less/**/*.less'
    },

    // javascript
    JAVASCRIPT: {

        // 组件
        COMPONENTS: {
            DIR: 'libs',
            SRC: SRC_DIR + 'libs/**/index.js',
            ALL: SRC_DIR + 'libs/**/*',
        },
        
        // 入口
        ENTRY: {
            DIR: 'js',
            SRC: SRC_DIR + 'js/**/index.js',
            ALL: SRC_DIR + 'js/**/*'
        },
        // 输出
        DIST: STATIC + 'js',
        // 第三方模块
        VENDOR: ['jquery'],
    },

    // css3 浏览器版兼容性前缀
    AUTOPREFIXER : ['last 2 versions', 'Firefox >= 20', 'ie >= 7', '> 5% in CN'],

    // 版本控制
    REV: {
        JSON: STATIC + 'manifest.json',
        DIST: STATIC,
        OPTIONS: {
            base: STATIC,
            path : STATIC + 'manifest.json',
            merge: true
        }
    }
}