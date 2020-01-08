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
    footerText: 'Copyright@Xiamen Infomation School ALL Rights 版权所有@厦门信息学校 闽ICP备 05020335 号',
    /** 
     * 接口请求
     * 例如：baseURL: 'https://some-domain.com/api/'
     */
    baseURL: baseUrlList[currentEnv],
    /** 
     * @desc 配置svg的url，配合组件(components/icon/icon.tsx)使用
     */
    svgUrl: '//at.alicdn.com/t/font_1531539_e14d3lv5vfq.js',
    /** 三个浏览文件的地址 */
    officeFileUrl: 'https://view.officeapps.live.com/op/view.aspx?src=',
    pdfFileUrl: 'http://cc.microspicy.com:8012/onlinePreview?url=',
    otherFileUrl: 'http://cc.microspicy.com:8012/onlinePreview?url='    
};
