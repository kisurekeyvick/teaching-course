import axios from 'axios'
import { httpRequest } from 'common/http/index';
import { message } from 'antd';
import { getToken, getUserBaseInfo } from '../function';
import { env } from 'environment';

interface IAdditionalParams {
    [key: string]: any;
}

function fileType(fileName: string) {
    return fileName.slice(fileName.lastIndexOf('.'))
}

export async function uploadFile(file: any, url: string, additionalParams: IAdditionalParams) {
    if (!(file instanceof Blob)) {
        message.error('您上传的不是文件。');
        return false;
    }

    try {
        const token = getToken();
        const { loginName, id: userId } = getUserBaseInfo();
        url = `${env.baseURL}${url}`;

        let fromData = new FormData();
        fromData.append('token', token);
        fromData.append('loginName', loginName);
        fromData.append('userId', userId);

        const paramsArr = Object.keys(additionalParams);
        fromData = paramsArr.reduce((pre, next) => {
            pre.append(next, additionalParams[next]);
            return pre;
        }, fromData);

        await axios.post(url, fromData);
    } catch (err) {
        throw new Error(err);
    }
}
