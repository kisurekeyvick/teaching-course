import * as React from 'react';
import { IFormItem, formItems } from './step-second.config';
import { Form, Upload, Icon, message, Modal } from 'antd';
import { api } from 'common/api/index';
import { messageFunc, IMessageFuncRes, getBase64 } from 'common/utils/function';
import { IUploadFileResponseResult, IAddSectionResponseResultDataResult } from 'common/api/api-interface';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import './step-second.scss';

interface IUploadStepSecondProps {
    successCallBack: Function;
    courseNode: IAddSectionResponseResultDataResult | null;
    [key: string]: any;
}

interface IState {
    overLinkFile: any;
    overLinkFileControlError: boolean;
    overLinkLoading: boolean;
    overLinkImg: string;
    overLinkImgPreview: boolean;
    materialFile: any;
    materialFileControlError: boolean;
    materialFileLoading: boolean;
    materialFileImg: string;
}

interface IConfig {
    formItems: IFormItem[];
    uploadPicFormat: string[];
}

class UploadStepSecondContainer extends React.PureComponent<IUploadStepSecondProps, IState> {
    public config: IConfig;
    
    constructor(public props: IUploadStepSecondProps) {
        super(props);

        this.config = {
            formItems: [...formItems],
            uploadPicFormat: [...dictionary.get('upload-pic-format')!].map((item: IDictionaryItem) => {
                return String(item.value);
            })
        };

        this.state = {
            overLinkFile: null,
            overLinkFileControlError: false,
            overLinkLoading: false,
            overLinkImg: '',
            overLinkImgPreview: false,
            materialFile: null,
            materialFileControlError: false,
            materialFileLoading: false,
            materialFileImg: ''
        };
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
            this.setState({
                overLinkLoading: true
            });

            const file: File = e.file;
            params.set('coverFile', file);

            this.updateCoverFile(params, loading).then(() => {
                getBase64(e.file, (imageUrl: string) => {
                    this.setState({
                        overLinkImg: imageUrl,
                        overLinkFile: [{
                            uid: Date.now(),
                            status: 'done',
                            url: imageUrl
                        }],
                        overLinkLoading: false
                    });
                });
            }, ()=> {
                this.setState({
                    overLinkLoading: false
                });
            });
        } else if (state === 'materialFile') {
            this.setState({
                materialFileLoading: true
            });

            const file: File = e.file;
            params.set('file', file);

            this.uploadFile(params, loading).then(() => {}).finally(() => {
                this.setState({
                    materialFileLoading: false
                });
            });
        }
    }

    /**
     * @func
     * @desc 上传教学材料文件
     */
    public uploadFile = (params: FormData, loading: IMessageFuncRes): Promise<any> => {
        return new Promise((resolve, reject) => {
            api.uploadFile(params).then((res: IUploadFileResponseResult) => {
                if (res.status === 200 && res.data.success) {
                    loading.success(res.data.desc);
                    this.props.successCallBack();
                    resolve();
                } else {
                    loading.error(res.data.desc);
                    reject();
                }
            });
        });
    }

    /** 
     * @callback
     * @desc 上传教材封面之前处理
     */
    public beforeUploadCoverFile = (file: any): boolean => {
        const { uploadPicFormat } = this.config;
        const fileType = file.type.replace('image/', '');

        if(uploadPicFormat.includes(fileType)) {
            return true;
        } else {
            const msg: string = uploadPicFormat.join('、').replace(/、$/, '');
            message.warn(`教材封面格式只支持： ${msg}`)
        }

        return false;
    }

    /** 
     * @func
     * @desc 上传教材封面
     */
    public updateCoverFile = (params: FormData, loading: IMessageFuncRes): Promise<any> => {
        return new Promise((resolve, reject) => {
            api.updateCoverFile(params).then((res: IUploadFileResponseResult) => {
                if (res.status === 200 && res.data.success) {
                    loading.success(res.data.desc);
                    resolve();
                } else {
                    loading.error(res.data.desc);
                    reject()
                }
            });
        });
    }

    /** 
     * @callback
     * @desc 查看教材封面图
     */
    public handleCoverFilePreview = () => {
        this.setState({
            overLinkImgPreview: true
        });
    }

    /** 
     * @callback
     * @desc 取消查看教材封面图
     */
    public handleCoverFilePreviewCancel = () => {
        this.setState({
            overLinkImgPreview: false
        });
    }

    /** 
     * @func
     * @desc 构建表单
     */
    public createForm = (): React.ReactNode => {
        const { overLinkFile, materialFile, overLinkLoading, materialFileLoading, overLinkImg, materialFileImg,
            overLinkImgPreview } = this.state;

        const showUploadList = {
            showPreviewIcon: true,
            showRemoveIcon: false
        };

        const content = (imgSrc: string, loading: boolean): React.ReactNode => {
            return <>
                {/* {   imgSrc ? 
                    <img src={imgSrc} alt="avatar" style={{ width: '100%' }} /> : 
                    <div><Icon type={loading? 'loading' : 'plus'} /> </div>
                } */}
                <div><Icon type={loading? 'loading' : 'plus'} /> </div>
            </>
        }

        return <Form>
                    <Form.Item className='upload-step-second-form-item' label={'教材封面上传'} key={'1'}>
                        <Upload
                            listType="picture-card"
                            fileList={overLinkFile}
                            showUploadList={showUploadList}
                            beforeUpload={this.beforeUploadCoverFile}
                            onPreview={this.handleCoverFilePreview}
                            customRequest={(e) => this.handleUploadRequest(e, 'overLinkFile')}>
                            { content(overLinkImg, overLinkLoading) }
                        </Upload>
                        {
                            overLinkImg && <Modal visible={overLinkImgPreview} footer={null} onCancel={this.handleCoverFilePreviewCancel}>
                                <img alt="example" style={{ width: '100%' }} src={overLinkImg} />
                            </Modal>
                        }
                    </Form.Item>

                    <Form.Item className='upload-step-second-form-item' label={'教材上传'} key={'2'}>
                        <Upload
                            listType="picture-card"
                            fileList={materialFile}
                            multiple={true}
                            customRequest={(e) => this.handleUploadRequest(e, 'materialFile')}
                            >
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
