import * as React from 'react';
import { IUploadStepFirstProps } from '../../interface';
import { IFormItem, formItems, formItemLayout, submitFormItemLayout, IFormValue } from './step-first.config';
import { Form, Button, Input, message, Select } from 'antd';
import { cloneDeep } from 'lodash';
import { api } from 'common/api/index';
import { TreeModalContainer, ITreeModalProps, treeModalResponse } from '../tree-Modal/tree-Modal';
import { IDictionaryItem } from 'common/dictionary/index';
import { IAddSectionRequest, IAddSectionResponseResult } from 'common/api/api-interface';
import { messageFunc } from 'common/utils/function';
import './step-first.scss';

interface IConfig {
    formItems: IFormItem[];
    materialId: string;
    parentId: string;
}

interface IState {
    location: string;
    loading: boolean;
    uploadLocationError: boolean;
    treeModalVisible: boolean;
}

const { Option } = Select;

class UploadStepFirstContainer extends React.PureComponent<IUploadStepFirstProps, IState> {
    public config: IConfig;

    constructor(public props: IUploadStepFirstProps) {
        super(props);

        this.state = {
            // imageUrl: '',
            /** 节点位置 */
            location: '',
            loading: false,
            /** 上传节点出错 */
            uploadLocationError: false,
            /** 展示tree节点弹窗 */
            treeModalVisible: false
        };

        this.config = {
            formItems: cloneDeep(formItems),
            materialId: '',
            parentId: ''
        }
    }

    /** 
     * @func
     * @desc mock上传成功进度条
     */
    // public mockUploadRequest = (e: any) => {
    //     e.onProgress();
    //     this.setState({
    //         loading: true
    //     });
    //     api.mockUpload().then(() => {
    //         this.setState({
    //             loading: false
    //         });
    //         e.onSuccess();
    //     });
    // }

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
    public handeTreeModalCallBack = (callbackParams: treeModalResponse) => {
        if (callbackParams) {
            this.setState({
                location: `${callbackParams.materialName} > ${callbackParams.chapterName}`,
                uploadLocationError: false
            });
    
            this.config = {
                ...this.config,
                materialId: callbackParams.materialId,
                parentId: callbackParams.chapterId
            };
        }

        this.handleTreeModalClick(false);
    }

    /** 
     * @func
     * @desc 构建表单
     */
    public createForm = (formItems: IFormItem[]): React.ReactNode => {
        const { getFieldDecorator } = this.props.form;
        const { uploadLocationError, location } = this.state;

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

                                if (item.controlName === 'button') {
                                    control = <>
                                        <Button type='primary' onClick={() => this.handleTreeModalClick(true)}>选择节点</Button>
                                        { location && <span className='tree-node-location'>{location}</span> }
                                    </>

                                    return control;
                                }

                                if (item.controlName === 'select') {
                                    control = <Select>
                                        {
                                            (item.source!).map((sourceItem: IDictionaryItem) => {
                                                return <Option key={`${item.state}-${sourceItem.value}`} value={sourceItem.value}>{sourceItem.name}</Option>;
                                            })
                                        }
                                    </Select>;

                                    return control;
                                }

                                return control;
                            })();

                            return <Form.Item className={`upload-form-item ${item.state}`} label={item.label} key={item.key}>
                                        {
                                            item.controlName === 'input' || item.controlName === 'select'?
                                            getFieldDecorator(item.state, {
                                                rules: item.rules || []
                                            })(Control) :
                                            Control
                                        }
                                        { item.controlName === 'button' && uploadLocationError && <div className='ant-form-explain'>请选择教材章节</div> }
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
     * @desc 验证特殊控件是否有效
     */
    public validSpecialControl = (): boolean => {
        const state = {
            uploadLocationError: false
        };

        state.uploadLocationError = !this.state.location;

        this.setState({
            ...state
        });

        return !(state.uploadLocationError);
    }

    /** 
     * @func
     * @desc 确认
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        const isvalid: boolean = this.validSpecialControl();

        this.props.form.validateFieldsAndScroll((err: any, values: IFormValue) => {
            if (!err && isvalid) {
                // const params: FormData = new FormData();
                // params.set('file', this.state.fileList[0].originFileObj);
                // const a: any = {
                //     'chapterId': 'CHAPTER201912121106019366537', 
                //     'materialId': 'MATERL201912121106019186655'
                // };
                // params.set('uploadRequestDto', JSON.stringify(a));

                // api.uploadFile(params).then((res: any) => {
                //     console.log('上传结果', res);
                // })
                const loading = messageFunc();
                const { materialId, parentId } = this.config;
                const { desc, name, fileFormat, fileType } = values;

                const params: IAddSectionRequest = {
                    materialId,
                    parentId,
                    teachChapter: {
                        desc,
                        name,
                        fileFormat: +(fileFormat),
                        fileType: +(fileType),
                        weight: 10
                    },
                    type: 2
                };

                api.addSection(params).then((res: IAddSectionResponseResult) => {
                    if (res.status === 200 && res.data.success) {
                        const { materialId, parentId } = this.config;
                        this.props.successCallBack({ materialId, chapterId: parentId });
                        loading.success(res.data.desc);
                    } else {
                        loading.error(res.data.desc);
                    }
                });

                message.success('发布成功');
            }
        });
    }

    public render() {
        const treeModalProps: ITreeModalProps = {
            handleClick: this.handeTreeModalCallBack
        };

        return <div className='upload-step-first-container animateCss'>
                    <div className='upload-content'>
                        { this.createForm(this.config.formItems) }
                    </div>
                    <div>
                        { this.state.treeModalVisible && <TreeModalContainer {...treeModalProps}/> }
                    </div>
                </div>
    }
}

export default Form.create()(UploadStepFirstContainer);
