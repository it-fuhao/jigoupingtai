/**
 * gulp 打包任务配置
 * @authors Chengyao (chandre21cn@gmail.com)
 * @date    2018-03-23 11:30:12
 */

const gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    del = require('del'),
    webpack = require('webpack-stream'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    less = require('gulp-less'), //3.5.0版本支持@import 更新
    autoprefixer = require('gulp-autoprefixer'),
    rev = require('gulp-rev'),
    uglify = require('gulp-uglify'),
    revCollector = require('gulp-rev-collector'),
    CONF = require('./config.js'),
    webpackConfig = require('./webpack.config.js');


// 页面处理
const HTML = next => {
    return gulp.src(CONF.HTML.SRC)
        .pipe(gulp.dest(CONF.HTML.DIST));
};

// 静态资源拷贝
const ASSETS = next => {
    return gulp.src(CONF.ASSETS.SRC)
        .pipe(gulp.dest(CONF.ASSETS.DIST));
}

// 字体拷贝
const FONT = next => {
    return gulp.src(CONF.FONT.SRC)
        .pipe(rev())
        .pipe(gulp.dest(CONF.FONT.DIST))
        .pipe(rev.manifest(CONF.REV.OPTIONS))
        .pipe(gulp.dest(CONF.REV.DIST)) 
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
        .pipe(rev())
        .pipe(gulp.dest(CONF.IMAGES.DIST))
        .pipe(rev.manifest(CONF.REV.OPTIONS))
        .pipe(gulp.dest(CONF.REV.DIST)) 
}

// less编译
const LESS = next => {
    return gulp.src(CONF.LESS.SRC)
        .pipe(less({
            compress: true,
            sourceMap: true,
            // less 全局变量
            globalVars: {
                // CDN服务器
                CDN_URL: `'${CONF.CDN_URL.PROD}'`,
                // 前缀
                PREFIX: `'${CONF.PREFIX}'`
            }
        }))
        .on('error', err => {
            gutil.log(gutil.colors.red('[Less Error!]'), err.message);
            next();
        })
        .pipe(rev())
        .pipe(autoprefixer({
            browsers: CONF.AUTOPREFIXER
        }))
        .pipe(gulp.dest(CONF.LESS.DIST))
        .pipe(rev.manifest(CONF.REV.OPTIONS))
        .pipe(gulp.dest(CONF.REV.DIST)) 
};

// JS 编译打包
const WEBPACK = next => {
    return gulp.src(CONF.JAVASCRIPT.ENTRY.SRC)
        .pipe(webpack(webpackConfig("production")))
        .on('error', err => {
            gutil.log(gutil.colors.red('[Webpack Error!]'), err.message);
            next();
        })
        .pipe(uglify({
            ie8: true
        })) //压缩文件
        .pipe(rev())
        .pipe(gulp.dest(CONF.JAVASCRIPT.DIST))
        .pipe(rev.manifest(CONF.REV.OPTIONS))
        .pipe(gulp.dest(CONF.REV.DIST)) 
}

//修改 html, css 资源版本号
const REV = next => {
    let JSON = CONF.REV.JSON,
        HTML = CONF.DIST_DIR + '**/*.html',
        CSS = CONF.DIST_DIR + '**/*.css';

    return gulp.src([JSON, HTML, CSS])
        .pipe( revCollector({
            replaceReved: true,
        }))
        .pipe(gulp.dest(CONF.DIST_DIR));
}

// 清理生成目录
const CLEANDIST = next => {
    return del(path.join(process.cwd(), CONF.DIST_DIR), {
        force: true
    })
};

gulp.task('build', gulp.series(
    CLEANDIST, 
    gulp.parallel(
        HTML, 
        ASSETS, 
        FONT, 
        IMAGES, 
        LESS, 
        WEBPACK
    ), 
    REV
));