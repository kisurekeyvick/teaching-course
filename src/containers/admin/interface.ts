import { IConfig, IForm, LoginParams } from 'containers/user/interface';

interface ICommon {
    [key: string]: any;
}

interface IUploadStepFirstProps {
    successCallBack: Function;
    [key: string]: any;
}

interface IAjaxResponse {
    data?: any;
    status?: number;
    statusText?: string;
    [key: string]: any;
}

interface ITreeNodeDrag extends ICommon {
    dropPosition?: number;
    dropToGap?: boolean;
    event?: any;
    ragNode?: any;
    node?: any;
}

export {
    ICommon,
    IConfig, 
    IForm, 
    LoginParams,
    IUploadStepFirstProps,
    IAjaxResponse,
    ITreeNodeDrag
}