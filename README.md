# 项目说明
- 名称：教学课程资源平台
- 框架：react ^16.9.0
- 脚手架：create-react-app
- 组件库：antd 
- 状态管理：redux
- 中间件：redux-saga

## 文件目录
```
    ├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
    ├── src                             项目源码目录
    │   ├── routers                     前端路由文件
    │   ├── components                  展示性组件目录
    │   ├── containers                  容器性组件目录
    │   ├── assets                      资源目录，这里的资源会被wabpack构建
    │   │   ├── style                   公共样式文件目录
    │   │   └── image                   图片存放目录
    │   ├── store                       应用级数据（state）
    │   │   └── index.js
    │   └── common                      公共文件
    │   │    ├── utils                  公共模块
    │── config                          wabpack配置
    │── .gitignore                      提交代码时候需要配置的忽略提交的代码目录
    │── README.md                       
```

# 环境配置与运行
## 第一步：环境配置
- [安装nodejs](http://nodejs.cn/download/)
- [安装yarn](https://yarnpkg.com/lang/zh-hans/docs/install/#mac-stable)
- [安装create-react-app](https://www.jianshu.com/p/c6040430b18d)
- [安装cnpm(也可不安装)](https://www.jianshu.com/p/96d7558e643b)

## 第二步：下载node_module
- yarn install(如果觉得下载慢，可以使用cnpm淘宝镜像进行下载)

## 第三步：启动项目
- yarn/npm start

# 项目配置
## antd自定义主题
- less版本下降到3.0以下，本项目版本：^2.7.2
- create-react-app 默认不支持less，所以需要使用npm run eject将webpack配置暴露出来
- 支持less样式文件，需要修改webpack.config.js，代码如下：
```
第51行开始ctrl v如下代码：
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
```
```
第462行开始ctrl v如下代码：
{
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders(
    {
        importLoaders: 2,
        sourceMap: isEnvProduction && shouldUseSourceMap
    },
    'less-loader'
    ),
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
},
```