import axios, { AxiosRequestConfig } from 'axios';
import { message  } from 'antd';
import { env } from 'environment/index';
import { getToken } from 'common/utils/function';

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
        const token: string = getToken();
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
        message.error(error, 5);
        // throw new Error(error);
    }
);

service.interceptors.response.use(
    response => {
      return response
    },
    error => {
        message.error(error, 5);
    //   throw new Error(error)
    },
)

export function request(config: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
        service.request(config).then(
            response => {
                if (response) {
                    const { data, status, statusText, headers } = response;

                    /** 会话过期 */
                    if (response.data.desc === '会话过期，请重新登陆' || response.data.code === 302) {
                        return relogin(response.data.desc);
                    }

                    /** 权限不足 */
                    if (response.data.code === 305) {
                        return message.error(response.data.desc);
                    }

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
            },
            err => {
                message.error(err.message);
                reject(err);
            }
        );
    });
}

function relogin(desc: string) {
    message.error(`${desc}, 5秒钟后将跳转至登录页。`, 5, () => {
        window.location.href = '/user/login';
    });
}
