import { message } from 'antd';

/** 解析查询字符串 */
export function parseQueryString(url: string): any {
    const params: any = {};

    if (url.indexOf('?') !== -1) {
        (url.split('?')[1].split('&') as string[]).map((item: string, index: number) => {
            const [key, value] = item.split('=');
            params[key] = value;
        });
    }

    return params;
}

/** 处理错误 */
export function handleError(res: any) {
    /** 
     * Todo：这里需要和后端约定，否则ok这个属性不一定存在
     * 针对特别的错误码，也要根据后端作调整
    */
    if (!res.ok) {
        message.error(res.statusText);
        throw Error(res.statusText);
    }

    return res;
}

/** 处理文件 */
export function handleFile() {

}

/** 登出 */
export function logOut() {

}