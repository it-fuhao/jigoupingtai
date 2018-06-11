# 基于 gulp + webpack 前端构建工具

### 安装、运行
- 安装 npm install
- 开发 npm start
- 打包 npm run build

### 代码引用 
1. 所有 js 文件以 index.js 为入口，当 index.js 包含在子目录下时，将使用子目录的目录名作为当前 js 文件
2. 页面引入 js 文件时，必须引入 vendor.js
```html
    <html>
        <head>       
            <link rel="stylesheet" href="/static/css/index.css"> <!-- 页面样式 -->
            <script src="/static/js/vendor.js"></script> <!-- 模块加载类及第三方模块 -->
            <script src="/static/js/common.js"></script> <!-- 自定义组件 -->
            <script src="/static/js/index.js"></script>
        </head>
        <body>
        </body>
    </html>
```
    
### 目录结构
```
|---project
|   |---api                             
|   |---build
|   |   |---apiMiddleware.js            数据模拟
|   |   |---config.js                   项目配置
|   |   |---eslint.config.js            js 代码检测配置
|   |   |---gulp.dev.js
|   |   |---gulp.prod.js
|   |   |---webpack.config.js
|   |---dist          
|   |   |---index.html
|   |   |---static                      打包后静态资源
|   |   |   |---assets                  
|   |   |   |---css
|   |   |   |   |---index.css
|   |   |   |---font                    字体文件
|   |   |   |---images                  
|   |   |   |---js
|   |   |   |   |---vendor.js           第三方模块
|   |   |   |   |---common.js           自定义组件
|   |   |   |   |---index.js            主页面js代码
|   |   |   |   |---user                与用户相关的模块js
|   |   |   |   |   |---login.js        登录页面js代码
|   |   |   |---manifest.json           文件版本信息
|   |---src                             开发
|       |---assets
|       |---componets                   自定义组件
|       |---font                        字体文件
|       |---images
|       |---less                        less 动态样式
|       |   |---base                    基础样式库（个人禁止修改）
|       |   |   |---animation.less      css3动画样式
|       |   |   |---common.less         公共样式
|       |   |   |---index.less          基础样式综合出口
|       |   |   |---normalize.less      标准样式库
|       |   |   |---reset.less          自定义标签重置样式
|       |   |---components              组件样式库
|       |   |---layout                  布局样式
|       |   |---minxins                 公共方法样式
|       |   |---pages                   各页面样式
|       |   |---variables               全局变量
|       |---js                          javascript
|       |   |---user 
|       |   |   |---login               将使用子目录的目录名作为当前 js 文件名
|       |   |   |   |---index.js    
|       |   |---index.js                主页面js
|       |---pages                       html 页面
|           |---index.html
|           |---user                    与用户相关的页面
|               |---login.html
|---gulpfile.js
|---package.json
```

### 项目配置 config.js 
> 所有配置类似,详细配置请查看config.js。[规则配置文档](https://github.com/isaacs/node-glob/blob/master/README.md)
#####  1、CDN_URL 全局变量
> less中调用：background: url(~'@{CDN_URL}images/img.jpg')
```js
    CDN_URL: {
        DEV: "../static/", //开发环境
        PROD: "http://cdn.youdomain.com/" //生产环境
    }
```

#####  2、JAVASCRIPT 配置
> js引入组件：var dialog = require("@components/dialog");

```js
    JAVASCRIPT: {
        // 组件
        COMPONENTS: {
            DIR: 'components',
            SRC: path.join(SRC_DIR, 'components/**/index.js'),
            ALL : path.join(SRC_DIR, 'components/**/*.js')
        },
        // 入口
        ENTRY: {
            DIR: 'js',
            SRC: path.join(SRC_DIR, 'js/**/index.js'),
            ALL : path.join(SRC_DIR, 'js/**/*.js')
        },
        // 输出
        DIST: path.join(STATIC, 'js'),
        // 第三方模块合并打成为 vendor.js
        VENDOR: ['jquery', 'underscore'],
    }
```
#####  3、HTML、ASSETS、IMAGES、FONT、LESS 配置
```js
    LESS: {
        SRC: path.join(SRC_DIR, 'less/*.less'), //less 源文件目录提取规则
        DIST: path.join(STATIC, 'css'), //css 输出目录
        ALL : path.join(SRC_DIR, 'less/**/*.less'), //动态编译监听规则
    }
```
# mockjs api数据模拟
> 定义数据模板[文档](https://github.com/nuysoft/Mock/wiki)
> 访问：http://localhost:8080/api/sidemenu.php
```js
module.exports = ( Mock ) => {
    return {
        // 路由地址
        route:'/api/sidemenu.php',
        // 返回数据类型
        dataType: "json",
        // 生成数据
        handle : function() {
            //定义数据模板
            return Mock.mock({
            });
        }
    }
};
```

