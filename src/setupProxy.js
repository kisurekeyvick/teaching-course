/**
 * react 请求代理
 */
const proxy = require('http-proxy-middleware');

module.exports = function (app) { 
    app.use(
        proxy('/api/microspicy', {
          target: 'http://api.microspicy.com:8078',
          changeOrigin: true
        })
    );
}