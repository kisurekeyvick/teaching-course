import loginLogo from 'assets/images/logo.jpg';
import pageLogo from 'assets/images/logo.jpg';
import loginBackground from 'assets/images/loginBg.webp';
import simpleLogo from 'assets/images/simpleLogo.jpg';

/** 当前执行环境 */
export type CurrentEnv = 'development' | 'production';

export const currentEnv: CurrentEnv = process.env.NODE_ENV as CurrentEnv;

/** 环境地址列表 */
export const baseUrlList = {
    development: 'http://api.microspicy.com:8078',  // '/api/microspicy', //'/api/microspicy', //
    production: 'http://api.microspicy.com:8078'
};

export const env = {
    name: '教学课程资源平台',
    footerText: 'Microspicy-Technology ©2019 Author Microspicy Technology',
    siderLogo: loginLogo,
    loginLogo,
    pageLogo,
    simpleLogo,
    loginBackground,
    /** 
     * 接口请求
     * 例如：baseURL: 'https://some-domain.com/api/'
     */
    baseURL: baseUrlList[currentEnv],
    /** 
     * @desc 配置svg的url，配合组件(components/icon/icon.tsx)使用
     */
    svgUrl: '//at.alicdn.com/t/font_1531539_b08zxu2hbjq.js'    
};
