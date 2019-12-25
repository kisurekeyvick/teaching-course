import axios from 'axios';
import LocalStorageService from 'common/utils/cache/local-storage'; //'../cache/local-storage';
import { env } from 'environment/index';

interface IOptions {
    method?: string;
    timeout?: number;
    responseType?: string;
    [key: string]: any;
}

const localStorageService: LocalStorageService = new LocalStorageService();

/**
 * @desc 默认加密
 * @param params 
 */

const axiosMethod = (url: string, config: IOptions) => {
    const defaultConfig = {
        // `url` 是用于请求的服务器 URL
        url: '/',
        // `method` 是创建请求时使用的方法
        method: 'POST',
        /**
         * `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
         * 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
         * 例如：baseURL: 'https://some-domain.com/api/',
         */
        baseURL: '',
        // `headers` 是即将被发送的自定义请求头
        headers: {
            'Content-Type': 'application/json',
        },
        /** 
         * `params` 是即将与请求一起发送的 URL 参数
         * 必须是一个无格式对象(plain object)或 URLSearchParams 对象
         */
        params: {},
        /**
         * `data` 是作为请求主体被发送的数据
         * 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
         */
        data: {},
        /** 
         * `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
         * 如果请求话费了超过 `timeout` 的时间，请求将被中断
         */
        timeout: 10000,
        /** 
         * `withCredentials` 表示跨域请求时是否需要使用凭证
         * 默认为false
         */
        withCredentials: true,
        /** 
         * `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
         */
        responseType: 'json',
        // validateStatus(status: number) {
        //     return status >= 200 && status < 300
        // },
    };

    /** 合并 */
    const finalConfig = { ...defaultConfig,...config, ...{
        baseURL: env.baseURL,
        url
    } };

    // return axios({
    //     ...finalConfig
    // });
};

class HttpService {
    private _headers: any = {};
    private _config: any;

    constructor(public url: string, public options: IOptions) {
        this._headers['Content-Type'] = 'application/json';

        this._config = {
            headers: this._headers,
            credentials: 'include'
        };
    }

    public getLocalStorageInfo(): any {
        const userInfo: any = localStorageService.get('userInfo');
        const token = userInfo.token || '';
        const userId = userInfo.id || null;
        const userName = userInfo.userName || '';
        const nickName = userInfo.nickName || '';

        return { userInfo, token, userId, userName, nickName };
    }

    get(config: any) {
        return axiosMethod(this.url, { ...this._config, ...config, ...{ method: 'GET' }, ...this.options });
    }

    post(bodyParams: any, config: any) {
        const { token, userId, userName, nickName } = this.getLocalStorageInfo();
        const user = (userName && userId && {userId, userName, nickName}) || {};

        // const _config = {des: true, ...config};
        // const _bodyParams: any= _config.des && {
        //     body: { ...bodyParams, token, ...user };

        // return axiosMethod(this.url, {
        //     ...this._config, ..._config,
        //     ...{ method: 'POST', data: JSON.stringify(_bodyParams), ...this.options }
        // });
    }

    /**
     * @desc 附件上传
     * @param bodyParams 
     */
    uploadFile(bodyParams: FormData) {
        const { token, userId, userName, nickName } = this.getLocalStorageInfo();
        bodyParams.append('token', token);
        bodyParams.append('userId', userId);
		bodyParams.append('userName', userName);
        bodyParams.append('nickName', nickName);
        
        return axiosMethod(this.url, {
            method: 'POST',
            data: {
                body: bodyParams
            },
            ...this.options,
            file: true
        });
    }

    delete(config: any) {
        return axiosMethod(this.url, {
            method: 'POST',
            ...this._config,
            ...config,
            ...this.options
        });
    }

    put(bodyParams: any, config: any) {
        return axiosMethod(this.url, {
            method: 'PUT',
            data: {
                body: JSON.stringify(bodyParams)
            },
            ...this._config,
            ...config,
            ...this.options
        });
    }

    patch(bodyParams: any, config: any) {
        return axiosMethod(this.url, {
            method: 'PATCH',
            data: {
                body: JSON.stringify(bodyParams)
            },
            ...this._config,
            ...config,
            ...this.options
        }); 
    }
}

export const httpService = (url: string, options: IOptions = {}) => {
    return new HttpService(url, options);
}
