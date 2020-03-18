/** 当前执行环境 */
export type CurrentEnv = 'development' | 'production';

export const currentEnv: CurrentEnv = process.env.NODE_ENV as CurrentEnv;

/** 环境地址列表 */
export const baseUrlList = {
    development: 'http://api.microspicy.com:8078',  // '/api/microspicy', //'/api/microspicy', //
    production: `http://${window.location.hostname}:8078`
};

export const env = {
    version: 'V1.0.12',
    releaseDate: '2020年2月3日',
    name: '城市轨道交通课程资源管理系统',
    footerText: 'Copyright@Xiamen Infomation School ALL Rights 版权所有@厦门信息学校 闽ICP备 05020335 号',
    /** 
     * 接口请求
     * 例如：baseURL: 'https://some-domain.com/api/'
     */
    baseURL: baseUrlList[currentEnv],
    /** 
     * @desc 配置svg的url，配合组件(components/icon/icon.tsx)使用
     */
    svgUrl: 'http://at.alicdn.com/t/font_1531539_y7j27qle3h.js',
    /** 三个浏览文件的地址,2020年1月24日修改地址,只能生产环境访问 */
    //officeFileUrl: 'https://view.officeapps.live.com/op/view.aspx?src=',
    officeFileUrl: `http://${window.location.hostname}:8012/onlinePreview?url=`,
    pdfFileUrl: `http://${window.location.hostname}:8012/onlinePreview?url=`,
    otherFileUrl: `http://${window.location.hostname}:8012/onlinePreview?url=`    
};
