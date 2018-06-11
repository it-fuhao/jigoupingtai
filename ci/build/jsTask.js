const path = require("path");
const Webpack = require('webpack-stream').webpack;
const webpackMerge = require("webpack-merge");
const fancyLog = require('fancy-log');
const supportsColor = require('supports-color');


var defaultStatsOptions = {
    colors: supportsColor.stdout.hasBasic,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: false,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false,
    warnings: false,
    chunkOrigins: false
};

const webpackConfig = require('./webpack.config.js');
const CONF = require('./config.js');
const config = webpackMerge( webpackConfig(), {
    output: {
        path: path.resolve(process.cwd(), CONF.JAVASCRIPT.DIST)
    },
    watch: true,
    profile: false,
    cache: true,
    plugins: [
        new Webpack.NoEmitOnErrorsPlugin()
    ]
});

Webpack(config, ( err , stats )=>{
    if (err) {
        return;
    }
    stats = stats || {};
    console.log(stats.toString(defaultStatsOptions))
    // fancyLog(stats.toString(defaultStatsOptions));
    process.send("reload")
})