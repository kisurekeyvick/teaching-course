import React from 'react';
import { Form, Button, Col, Row, Input, Select, Radio, message, Upload, Icon } from 'antd';
import { api } from 'common/api/index';
import { IUserFormModifyProps } from './step-second.config';
import { messageFunc, IMessageFuncRes, getBase64 } from 'common/utils/function';
import { IUpdateTeacherFileResponseResult } from 'common/api/api-interface';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import './step-second.scss';

interface IState {
    [key: string]: any;
}

interface IConfig {
    uploadPicFormat: string[];
}

const { Item } = Form;
const { TextArea } = Input;

class userFormModify extends React.PureComponent<IUserFormModifyProps, IState> {
    public config: IConfig;

    constructor(public props: IUserFormModifyProps) {
        super(props);

        this.config = {
            uploadPicFormat: [...dictionary.get('upload-pic-format')!].map((item: IDictionaryItem) => {
                return String(item.value);
            })
        }
    }

    /** 
     * @func
     * @desc 取消
     */
    public cancel = () => {
        this.props.callBack({ type: 'cancel' });
    }

    /** 
     * @callback
     * @desc 上传之前处理
     */
    public beforeUpload = (file: any): boolean => {
        const { uploadPicFormat } = this.config;
        const fileType = file.type.replace('image/', '');

        if(uploadPicFormat.includes(fileType)) {
            return true;
        } else {
            const msg: string = uploadPicFormat.join('、').replace(/、$/, '');
            message.warn(`头像格式只支持： ${msg}`)
        }

        return false;
    }

    
    /** 
     * @callback
     * @desc 处理上传
     */
    public handleUploadRequest = (e: any) => {
        const { uploadFilePersonParams } = this.state;
        const loading = messageFunc('开始上传中...');
        const params: FormData = new FormData(); 
        params.set('teacherDto', JSON.stringify({...uploadFilePersonParams}));

        const file: File = e.file;
        params.set('file', file);

        api.updateTeacherFile(params).then((res: IUpdateTeacherFileResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success(res.data.desc);
                e.onSuccess();
                this.props.eventEmitterFunc();
            } else {
                loading.error(res.data.desc);
                e.onError();
            }
        });
    }
}

export default Form.create()(userFormModify);
