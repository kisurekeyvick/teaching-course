import { Method, AxiosResponse, AxiosRequestConfig } from 'axios';
import { request } from './request';

type Config = string;

interface Api {
    (payload?: object, config?: Partial<AxiosRequestConfig>): AxiosResponse['data']
}

interface IHttpRequest {
    (config: Config): Api
}

const httpRequest: IHttpRequest = (config: Config) => {
    let url: string = config;
    let method: Method = 'GET';
    const paramsArray: Array<string> = config.split(' ');

    if (paramsArray.length === 2) {
        [method, url] = paramsArray as [Method, string];
    }

    /**
     * @params payload          请求的具体参数数据
     * @params overrideConfig   请求的配置
     */
    return (payload, overrideConfig) => {
        return request({
            url,
            method,
            /** 
             * `params` 是即将与请求一起发送的 URL 参数
             * 必须是一个无格式对象(plain object)或 URLSearchParams 对象
             * 
             * `data` 是作为请求主体被发送的数据
             * 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
             */
            [method === 'GET' ? 'params' : 'data']: payload,
            // paramsSerializer: params => '',
            ...overrideConfig,
            headers: {
                'Access-Control-Expose-Headers': 'token',
                // 'Content-Type': 'multipart/form-data;charset=UTF-8'
            }
        });
    };
}

export { 
    httpRequest
}
