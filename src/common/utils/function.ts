import LocalStorageService from 'common/utils/cache/local-storage';
import { StorageItemName } from 'common/utils/cache/storageCacheList';
import { message } from 'antd';

export const localStorageService =  new LocalStorageService();

/** 
 * @desc 获取token
 */
export function getToken() {
    const result = localStorageService.get(StorageItemName.TOKEN);
    const token: string = result ? result.value.token : '';
    return token;
}

/**
 * @desc 获取用户基本信息
 */
export function getUserBaseInfo() {
    const result = localStorageService.get(StorageItemName.LOGINCACHE);
    const userInfo = result ? result.value : null;
    return userInfo;
}

/**
 * @desc 获取屏幕分辨率
 */
export function getScreenInfo() {
    const { offsetHeight, offsetWidth } = document.body;
    return { offsetHeight, offsetWidth }
}

export const isType = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
export const isArray = (obj: any) => Array.isArray(obj) || isType(obj) === 'array';
export  const isNullOrUndefined = (obj: any) => obj === null || obj === undefined;

/**
 * @desc 获取图片的base64
 * @param img 
 * @param callback 
 */
export function getBase64(img: Blob, callback: Function) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

/**
 * @desc 计算分数
 * @param maxScore 
 * @param currentScore 
 */
export function calculateScore(maxScore: number, currentScore: number) {
    return (currentScore/maxScore) * 5;
}

export interface IMessageFuncRes {
    success: (successDesc?: string, seconds?: number) => void;
    error:  (errorDesc?: string, seconds?: number) => void;
    warn:  (wornDesc?: string, seconds?: number) => void;
}

/**
 * @desc 消息提示
 * @param loadDesc 
 * @param successDesc 
 * @param errorDesc 
 */
export function messageFunc(loadDesc: string = '加载数据中'): IMessageFuncRes {
    const loading = message.loading(loadDesc, 0);

    return {
        success: function( successDesc: string = '加载完成', seconds: number = 2) {
            loading();
            message.success(successDesc, seconds);
        },
        error: function(errorDesc: string = '', seconds: number = 2) {
            loading();
            message.error(errorDesc, seconds);
        },
        warn: function(wornDesc: string = '', seconds: number = 2) {
            loading();
            message.warning(wornDesc, seconds);
        },
    }
}

/**
 * @desc 重新登录
 * @param desc 
 */
export function relogin(desc: string = '', seconds: number = 5) {
    message.info(`${desc}, ${seconds}秒钟后将跳转至登录页。`, seconds, () => {
        window.location.href = '/user/login';
    });
}

/**
 * @desc 浏览文件
 * @param param0 
 */
export function browseFile({ fileFormat, url }: { fileFormat: number | string; url: string }) {
    window.open(url);
}

/**
 * @desc 下载文件
 * @param param0 
 */
export function downloadFile({ fileName, fileFormat, url }: { fileName: string; fileFormat: number | string; url: string }) {
    const aEle: HTMLAnchorElement = document.createElement('a');
    aEle.href = url;
    aEle.download = fileName;
    aEle.target = '_blank';
    aEle.click();
}

/**
 * @desc 去抖动
 * @param time 延迟时间
 */
export function debounce(time: number) {
    let timer: any;

    return (func: Function) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function() {
            func();
        }, time);
    };
}