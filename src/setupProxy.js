/**
 * react 请求代理
 */
const proxy = require('http-proxy-middleware');

module.exports = function (app) { 
    app.use(
        proxy('/common', {
          target: 'http://172.20.1.148:8082',
          changeOrigin: true
        })
    );

    app.use(
        proxy('/back', {
          target: 'http://172.20.1.148:8082',
          changeOrigin: true
        })
    );
}