import * as React from 'react';
import { IUploadContainerProps } from '../interface';
import { IFormItem, formItems, IBtnGroupOptions, typeOptions } from './source-upload.config';
import { Form, Button, Icon, Input, Upload, message } from 'antd';
import { cloneDeep } from 'lodash';
import { api } from 'common/api/index';
import { TreeModalContainer, ITreeModalProps } from './tree-Modal';
import './source-upload.scss';

interface IConfig {
    formItems: IFormItem[]
}

class UploadContainer extends React.Component<IUploadContainerProps, any> {
    public config: IConfig;

    constructor(public props: IUploadContainerProps) {
        super(props);

        this.state = {
            fileList: [],
            typeOptions: cloneDeep(typeOptions),
            typeSelected: false,
            imageUrl: '',
            /** 节点位置 */
            location: '',
            loading: false,
            uploadControlError: false,
            typeControlError: false,
            /** 上传节点出错 */
            uploadLocationError: false,
            /** 展示tree节点弹窗 */
            treeModalVisible: false
        };

        this.config = {
            formItems: cloneDeep(formItems)
        }
    }

    /** 
     * @func
     * @desc 文件发生改变
     */
    public handleFileChange = (info: any) => {
        this.setState({ 
            fileList: [...info.fileList],
            uploadControlError: info.fileList.length === 0
        });
    }

    /** 
     * @func
     * @desc mock上传成功进度条
     */
    public mockUploadRequest = (e: any) => {
        e.onProgress();
        this.setState({
            loading: true
        });
        api.mockUpload().then(() => {
            this.setState({
                loading: false
            });
            e.onSuccess();
        });
    }

    /** 
     * @callback
     * @desc 显示隐藏tree弹窗
     */
    public handleTreeModalClick = (visible: boolean) => {
        this.setState({
            treeModalVisible: visible
        });
    }

    /** 
     * @callback
     * @desc 处理点击后关闭tree组件后
     */
    public handeTreeModalCallBack = (callbackParams: any) => {
        this.setState({
            location: callbackParams
        });
        this.handleTreeModalClick(false);
    }

    /** 
     * @func
     * @desc 构建表单
     */
    public createForm = (formItems: IFormItem[]): React.ReactNode => {
        const { getFieldDecorator } = this.props.form;
        const { uploadControlError, typeControlError, uploadLocationError } = this.state;

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 21 },
            },
        };

        const submitFormItemLayout = {
            wrapperCol: {
                sm: { span: 24 }
            }
        };

        return <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    {
                        formItems.map((item: IFormItem) => {
                            const Control: React.ReactNode = ((): React.ReactNode => {
                                let control: React.ReactNode = <div></div>;
                                
                                if (item.controlName === 'input') {
                                    item.controlType === 'text' && (control = <Input placeholder={item.placeholder}/>);

                                    item.controlType === 'textarea' && (control = <Input.TextArea placeholder={item.placeholder} autosize={{ minRows: 3, maxRows: 5 }}/>);
                                
                                    return control;
                                }

                                if (item.controlName === 'upload') {
                                    const { imageUrl } = this.state;

                                    const uploadButton: React.ReactNode = (
                                        <div>
                                          <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        </div>
                                    );

                                    const showUploadList = {
                                        showPreviewIcon: false,
                                        showRemoveIcon: true
                                    };

                                    control = <Upload
                                                listType="picture-card"
                                                fileList={this.state.fileList}
                                                showUploadList={showUploadList}
                                                multiple={true}
                                                customRequest={this.mockUploadRequest}
                                                onChange={this.handleFileChange}>
                                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                            </Upload>

                                    return control;
                                }

                                if (item.controlName === 'button') {
                                    control = <Button type='primary' onClick={() => this.handleTreeModalClick(true)}>选择节点</Button>

                                    return control;
                                }

                                if (item.controlName === 'btn-group') {
                                    control = (this.state.typeOptions as Array<IBtnGroupOptions>).map((item: IBtnGroupOptions) => {
                                        const type = item.selected ? 'primary' : 'default';
                                        return <Button className='btn-group-item' type={type} onClick={() => this.selectTypeControl(item)} key={item.key}>{item.name}</Button>
                                    });

                                    return control;
                                }

                                return control;
                            })();

                            return <Form.Item className={`upload-form-item ${item.state}`} label={item.label} key={item.key}>
                                        {
                                            item.controlName === 'input'?
                                            getFieldDecorator(item.state, {
                                                rules: item.rules || []
                                            })(Control) :
                                            Control
                                        }
                                        { item.controlName === 'button' && uploadLocationError && <div className='ant-form-explain'>请选择上传节点</div> }
                                        { item.controlName === 'upload' && uploadControlError && <div className='ant-form-explain'>请上传教材</div> }
                                        { item.controlName === 'btn-group' && typeControlError && <div className='ant-form-explain'>请选择分类</div> }
                                    </Form.Item>
                        })
                    } 
                    <Form.Item className='submit-form-item' {...submitFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
    }

    /** 
     * @func
     * @desc 类型选择
     */
    public selectTypeControl = (item: IBtnGroupOptions) => {
        const typeOptions: IBtnGroupOptions[] = this.state.typeOptions.map((i: IBtnGroupOptions) => {
            i.selected = i.key === item.key;
            return i;
        });

        this.setState({
            typeOptions,
            typeSelected: true,
            typeControlError: false
        });
    }

    /** 
     * @func
     * @desc 验证特殊控件是否有效
     */
    public validSpecialControl = (): boolean => {
        const state: { uploadControlError: boolean, typeControlError: boolean, uploadLocationError: boolean } = {
            uploadControlError: false,
            typeControlError: false,
            uploadLocationError: false
        };

        state.uploadControlError = this.state.fileList.length === 0;
        state.typeControlError = !this.state.typeSelected;
        state.uploadLocationError = !this.state.location;

        this.setState({
            ...state
        });

        return !(state.uploadControlError && state.typeControlError && state.uploadLocationError);
    }

    /** 
     * @func
     * @desc 确认
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        const isvalid: boolean = true;// this.validSpecialControl();

        this.props.form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err && isvalid) {
                const params: FormData = new FormData();
                params.set('file', this.state.fileList[0].originFileObj);
                const a: any = {
                    'chapterId': 'CHAPTER201912121106019366537', 
                    'materialId': 'MATERL201912121106019186655'
                };
                params.set('uploadRequestDto', JSON.stringify(a));

                api.uploadFile(params).then((res: any) => {
                    console.log('上传结果', res);
                })

                message.success('发布成功');
            }
        });
    }

    public render() {
        const treeModalProps: ITreeModalProps = {
            handleClick: this.handeTreeModalCallBack
        };

        return <div className='upload-container animateCss'>
                    <div className='upload-content'>
                        { this.createForm(this.config.formItems) }
                    </div>
                    <div className=''>
                        { this.state.treeModalVisible && <TreeModalContainer {...treeModalProps}/> }
                    </div>
                </div>
    }
}

export default Form.create()(UploadContainer);