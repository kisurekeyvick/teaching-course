import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getToken } from '../utils/function';
import { env } from 'environment/index';

const service = axios.create({
    timeout: 120000,
    responseType: 'text',
    /** 跨域请求否需要使用凭证 */
    withCredentials: true
});

service.interceptors.request.use(
    async config => {
        let { url = '' } = config;
        const { headers = {} } = config;
        const token: string = '123'; //getToken();
        /** 请求的具体地址 */
        url = `${env.baseURL}${url}`;

        return Object.assign(
            config,
            { url },
            {
                headers: Object.assign(headers, {
                    'token': token
                })
            }
        );
    }, 
    error => {
        message.error(error);
        // throw new Error(error);
    }
);

service.interceptors.response.use(
    response => {
      return response
    },
    error => {
        message.error(error);
    //   throw new Error(error)
    },
)

export function request(config: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
        service.request(config).then(
            response => {
                if (response) {
                    const { data, status, statusText, headers } = response;

                    resolve({ data, status, statusText, headers });
                }
                // const { data: content = {} } = response;
                // const { responseType } = config;
    
                // /** 文件流形式返回 */
                // if (responseType === 'blob') {
                //     return response;
                // }
    
                // /** 
                //  * TODO:
                //  * 如果出现code为401,则需要重新登录 */
                // if (content.code === 401 ) {
                //     relogin();
                // }
    
                // /** 
                //  * TODO:
                //  * 其他错误情况还需要处理
                //  */
    
                //  /** 返回结果 */
                //  return content;
            },
            err => {
                message.error(err.message);
                reject(err);
            }
        );
    });
}

function relogin() {
    window.location.href = '/user/login'
}
