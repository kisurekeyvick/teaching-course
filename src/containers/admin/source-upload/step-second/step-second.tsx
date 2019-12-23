import * as React from 'react';
import { IFormItem, formItems } from './step-second.config';
import { Form, Upload, Icon } from 'antd';
import { api } from 'common/api/index';
import { messageFunc, IMessageFuncRes } from 'common/utils/function';
import { IUploadFileResponseResult, IAddSectionResponseResultDataResult } from 'common/api/api-interface';
import './step-second.scss';

interface IUploadStepSecondProps {
    successCallBack: Function;
    courseNode: IAddSectionResponseResultDataResult | null;
    [key: string]: any;
}

interface IState {
    overLinkFile: any;
    overLinkFileControlError: boolean;
    overLinLoading: boolean;
    overLinkImg: string;
    materialFile: any;
    materialFileControlError: boolean;
    materialFileLoading: boolean;
    materialFileImg: string;
}

interface IConfig {
    formItems: IFormItem[];
}

class UploadStepSecondContainer extends React.PureComponent<IUploadStepSecondProps, IState> {
    public config: IConfig;
    
    constructor(public props: IUploadStepSecondProps) {
        super(props);

        this.config = {
            formItems: [...formItems]
        };

        this.state = {
            overLinkFile: null,
            overLinkFileControlError: false,
            overLinLoading: false,
            overLinkImg: '',
            materialFile: null,
            materialFileControlError: false,
            materialFileLoading: false,
            materialFileImg: ''
        };
    }

    /** 
     * @func
     * @desc 文件发生改变
     */
    public handleFileChange = (e: any, state: string) => {
        // this.setState({ 
        //     fileList: [...info.fileList],
        //     uploadControlError: info.fileList.length === 0
        // });
    }

    /** 
     * @func
     * @desc 处理上传请求
     * @desc2 TODO: 当前的接口存储不了，需要有一个特殊的ID，它用于标志是哪个具体资源的
     */
    public handleUploadRequest = (e: any, state: string) => {
        const { courseNode } = this.props;
        const loading = messageFunc('开始上传中...');
        /** parentId是章节的id */
        const params: FormData = new FormData();
        const json = {...courseNode};
        params.set('teachChapter', JSON.stringify(json));
        
        if (state === 'overLinkFile') {
            const file: File = e.file;
            params.set('coverFile', file);

            this.updateCoverFile(params, loading);
        } else if (state === 'materialFile') {
            const file: File = e.file;
            params.set('file', file);

            this.uploadFile(params, loading);
        }
    }

    /**
     * @func
     * @desc 上传教学材料文件
     */
    public uploadFile = (params: FormData, loading: IMessageFuncRes) => {
        api.uploadFile(params).then((res: IUploadFileResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success(res.data.desc);
                this.props.successCallBack();
            } else {
                loading.error(res.data.desc);
            }
        });
    }

    /** 
     * @func
     * @desc 上传教材封面
     */
    public updateCoverFile = (params: FormData, loading: IMessageFuncRes) => {
        api.updateCoverFile(params).then((res: IUploadFileResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success(res.data.desc);
            } else {
                loading.error(res.data.desc);
            }
        });
    }

    /** 
     * @func
     * @desc 构建表单
     */
    public createForm = (): React.ReactNode => {
        const { overLinkFile, materialFile, overLinLoading, materialFileLoading, overLinkImg, materialFileImg } = this.state;

        const showUploadList = {
            showPreviewIcon: false,
            showRemoveIcon: true
        };

        const content = (imgSrc: string, loading: boolean): React.ReactNode => {
            return <>
                {   imgSrc ? 
                    <img src={imgSrc} alt="avatar" style={{ width: '100%' }} /> : 
                    <div><Icon type={loading? 'loading' : 'plus'} /> </div>
                }
            </>
        }

        return <Form>
                    <Form.Item className='upload-step-second-form-item' label={'教材封面上传'} key={'1'}>
                        <Upload
                            listType="picture-card"
                            fileList={overLinkFile}
                            showUploadList={showUploadList}
                            customRequest={(e) => this.handleUploadRequest(e, 'overLinkFile')}
                            onChange={(e) => this.handleFileChange(e, 'overLinkFile')}>
                            { content(overLinkImg, overLinLoading) }
                        </Upload>
                    </Form.Item>

                    <Form.Item className='upload-step-second-form-item' label={'教材上传'} key={'2'}>
                        <Upload
                            listType="picture-card"
                            fileList={materialFile}
                            showUploadList={showUploadList}
                            multiple={true}
                            customRequest={(e) => this.handleUploadRequest(e, 'materialFile')}
                            onChange={(e) => this.handleFileChange(e, 'materialFile')}>
                            { content(materialFileImg, materialFileLoading) }
                        </Upload>
                    </Form.Item>
        </Form>
    }

    public render() {
        return  <div className='upload-step-second-container animateCss'>
                    <div className='upload-content'>
                        { this.createForm() }
                    </div>
                </div>
    }
}

export default Form.create()(UploadStepSecondContainer);
