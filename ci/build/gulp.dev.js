/**
 * gulp 开发环境任务配置
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

const gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    del = require('del'),
    webpackStream = require('webpack-stream'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    eslint = require('gulp-eslint'),
    eslintConf = require("./eslint.config.js"),
    cached = require("gulp-cached"),
    imagemin = require('gulp-imagemin'),
    less = require('gulp-less'), //3.5.0版本支持@import 更新
    autoprefixer = require('gulp-autoprefixer'),
    CONF = require('./config.js'),
    chokidar = require("chokidar"),
    webpackConfig = require('./webpack.config.js');

const reload = browserSync.reload;


// 页面处理
const HTML = next => {
    return gulp.src(CONF.HTML.SRC)
        .pipe(cached("HTML"))
        .pipe(gulp.dest(CONF.HTML.DIST))
        .pipe(reload({
            stream: true
        })); 
};

// 静态资源拷贝
const ASSETS = next => {
    return gulp.src(CONF.ASSETS.SRC)
        .pipe(cached("ASSETS"))
        .pipe(gulp.dest(CONF.ASSETS.DIST))
        .pipe(reload({
            stream: true
        })); 
}

// 字体拷贝
const FONT = next => {
    return gulp.src(CONF.FONT.SRC)
        .pipe(cached("FONT"))
        .pipe(gulp.dest(CONF.FONT.DIST))
        .pipe(reload({
            stream: true
        })); 
}

// 图片压缩与拷贝
const IMAGES = next => {
    return gulp.src(CONF.IMAGES.SRC)
        .pipe(imagemin({
            optimizationLevel: 5, //取值范围：0-7（优化等级）
            progressive: true, //无损压缩jpg图片
            interlaced: true, //隔行扫描gif进行渲染
            multipass: true //多次优化svg直到完全优化
        }))
        .pipe(cached("IMAGES"))
        .pipe(gulp.dest(CONF.IMAGES.DIST))
        .pipe(reload({
            stream: true
        })); 
}

// less编译
const LESS = next => {
    return gulp.src(CONF.LESS.SRC)
        .pipe(less({
            // less 全局变量
            modifyVars: {
                // CDN服务器
                CDN_URL: `'${CONF.CDN_URL.DEV}'`,
                PREFIX: `'${CONF.PREFIX}'`,
            }
        }))
        .pipe(autoprefixer({
            browsers: CONF.AUTOPREFIXER
        }))
        .pipe(cached("LESS"))
        .pipe(gulp.dest(CONF.LESS.DIST))
        .pipe(reload({
            stream: true
        })); 
};

// 清理生成目录
const CLEANDIST = next => {
    return del(path.join(process.cwd(), CONF.DIST_DIR), {
        force: true
    })
};

// web服务
const WEBSERVER = next => {
    browserSync.init({
        port: CONF.PORT,
        notify: false,
        server: {
            // 文件目录
            baseDir: CONF.DIST_DIR,
            // 中间件mockjs
            middleware: require("./apiMiddleware.js")()
        }
    });
    next();
}

// 创建js执行任务
// const JSTask = new taskManager();
let worker = null;
const childProcess = require("child_process");

const WEBPACK = function(next) {
    worker = childProcess.fork( path.join(__dirname, "jsTask.js"));
    worker.on("message",function(message){
        if (message=="reload") {
            browserSync.reload();
        }
    })
    next && next();
}

// 重启任务
const restartWorker = function() {
    // 移除任务
    if (worker) {
        console.log("Webpack 重新启动中...")
        // 删除JS目录
        del(path.join(process.cwd(), CONF.JAVASCRIPT.DIST), {
            force: true
        })
        worker.kill();
    }
    return WEBPACK();
}


// const WEBPACK = next => {
    // return gulp.src(CONF.JAVASCRIPT.ENTRY.SRC)
    //     .pipe(eslint(eslintConf)) // JS检查
    //     .pipe(eslint.format())
    //     .pipe(webpackStream(webpackConfig()))
    //     .on('error', err => {
    //         gutil.log(gutil.colors.red('[Webpack Error!]'), err.message);
    //         next();
    //     })
    //     .pipe(cached("WEBPACK"))
    //     .pipe(gulp.dest(CONF.JAVASCRIPT.DIST))
    //     .pipe(reload({
    //         stream: true
    //     })); 
    // next();
// }

// 监听webpack任务
let watcher = chokidar.watch([CONF.JAVASCRIPT.ENTRY.ALL, CONF.JAVASCRIPT.COMPONENTS.ALL]);
// 监听文件
const WATCH = next => {
    gulp.watch(CONF.HTML.SRC, gulp.series(HTML));
    gulp.watch(CONF.ASSETS.SRC, gulp.series(ASSETS));
    gulp.watch(CONF.FONT.SRC, gulp.series(FONT));
    gulp.watch(CONF.IMAGES.SRC, gulp.series(IMAGES));
    gulp.watch(CONF.LESS.ALL, gulp.series(LESS));
    
    watcher.on("all", (event,path)=>{
        if (event=="add" || event=="unlink" || event=="unlinkDir") {
            restartWorker()
        }
        // if (event=="change") {
        //     browserSync.reload();
        // }
    });

    next();
}

gulp.task('dev', gulp.series(
    CLEANDIST, 
    gulp.parallel(
        HTML, 
        ASSETS, 
        FONT, 
        IMAGES, 
        LESS, 
        WEBPACK
    ),
    WATCH,
    WEBSERVER
));









