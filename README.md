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