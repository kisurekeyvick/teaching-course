import React from 'react';
import { Form, Button, Col, Row, Input, Select, Radio, message, Upload, Icon, Modal } from 'antd';
import { IFormParams, IConfig, rules, IModifySourceProps } from './modify-source.config';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import { api } from 'common/api/index';
import { messageFunc, IMessageFuncRes, getBase64 } from 'common/utils/function';
import { IUploadFileResponseResult, IUpdateResourcesResponseResult, IUpdateResourcesRequest } from 'common/api/api-interface';
import { TreeModalContainer, ITreeModalProps, treeModalResponse } from 'containers/admin/source-upload/tree-Modal/tree-Modal';
import './modify-source.scss';

interface IState {
    overLinkImg: string;
    overLinkFile: any;
    overLinkImgPreview: boolean;
    overLinkLoading: boolean;
    source: any;
    location: string;
    materialId: string;
    parentId: string;
    updateTime: number;
    loading: boolean;
    [key: string]: any;
}

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

class modifySourceContainer extends React.PureComponent<IModifySourceProps, IState> {
    public config: IConfig;

    constructor(public props: IModifySourceProps) {
        super(props);

        this.config = {
            rules: rules,
            sourceType: dictionary.get('source-type')!.map((item) => {
                item.value = String(item.value);
                return item;
            }),
            sourceFormat: dictionary.get('source-format')!.map((item) => {
                item.value = String(item.value);
                return item;
            }),
            fileLength: 1,
            uploadPicFormat: [...dictionary.get('upload-pic-format')!].map((item: IDictionaryItem) => {
                return String(item.value);
            })
        };

        this.state = {
            overLinkImg: '',
            overLinkFile: null,
            overLinkImgPreview: false,
            overLinkLoading: false,
            loading: false,
            location: '',
            materialId: '',
            parentId: '',
            updateTime: 0,
            source: {
                name: '',
                desc: '',
                fileType: '',
                fileFormat: ''
            }
        };
    }

    static getDerivedStateFromProps(nextProps: IModifySourceProps, prevState: IState) {
        if (nextProps.updateTime > prevState.updateTime) {
            const { coverLink } = nextProps.source; 

            return {
                overLinkImg: coverLink,
                overLinkFile: [{
                    uid: Date.now(),
                    status: 'done',
                    url: coverLink
                }],
                source: nextProps.source,
            }
        }

        return null;
    }

    /** 
     * @func
     * @desc 取消
     */
    public cancel = () => {
        console.log(this.props.source);
        this.props.callBack({ type: 'cancel' });
    }

    /** 
     * @func
     * @desc 上传
     */
    public handleUploadRequest = (e: any) => {
        const { source } = this.state;
        const loading = messageFunc('开始上传中...');
        /** parentId是章节的id */
        const params: FormData = new FormData();
        const json = {...source};
        params.set('teachChapter', JSON.stringify(json));

        this.setState({
            overLinkLoading: true,
            updateTime: Date.now()
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
                    overLinkLoading: false,
                    updateTime: Date.now()
                });
            });
        }, ()=> {
            this.setState({
                overLinkLoading: false,
                updateTime: Date.now()
            });
        });
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
     * @desc 构建教材封面上传节点
     */
    public buildOverLinkUploadNode = (): React.ReactNode => {
        const { overLinkFile, overLinkImg, overLinkImgPreview, overLinkLoading } = this.state;
        const showUploadList = {
            showPreviewIcon: true,
            showRemoveIcon: false
        };
        const uploadButton = (): React.ReactNode => {
            return <>
                {/* coverLink ? 
                <img src={coverLink} alt="avatar" style={{ width: '100%' }} /> :  */}
                <Icon type={overLinkLoading ? 'loading' : 'plus'} />
            </>
        };

        return <>
                    <Upload
                        listType="picture-card"
                        fileList={overLinkFile}
                        showUploadList={showUploadList}
                        beforeUpload={this.beforeUploadCoverFile}
                        onPreview={this.handleCoverFilePreview}
                        customRequest={this.handleUploadRequest}>
                        { uploadButton() }
                    </Upload>
                    {
                        overLinkImg && <Modal visible={overLinkImgPreview} footer={null} onCancel={this.handleCoverFilePreviewCancel}>
                            <img alt="example" style={{ width: '100%' }} src={overLinkImg} />
                        </Modal>
                    }
                </>
    }

    /** 
     * @callback
     * @desc 显示隐藏tree弹窗
     */
    public handleTreeModalClick = (visible: boolean) => {
        this.setState({
            treeModalVisible: visible,
            updateTime: Date.now()
        });
    }

    /** 
     * @callback
     * @desc 处理点击后关闭tree组件后
     */
    public handeTreeModalCallBack = (callbackParams: treeModalResponse) => {
        if (callbackParams) {
            this.setState({
                materialId: callbackParams.materialId,
                parentId: callbackParams.chapterId,
                location: `${callbackParams.materialName} > ${callbackParams.chapterName}`,
                updateTime: Date.now()
            });
        }

        this.handleTreeModalClick(false);
    }

    /** 
     * @func
     * @desc 提交表单
     */
    public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: IFormParams) => {
            if (!err) {
                const loading = messageFunc('正在保存中...');
                const { source, materialId, parentId } = this.state;
                const params: IUpdateResourcesRequest = {
                    ...source,
                    name: values.name,
                    desc: values.desc,
                    fileType: values.fileType,
                    fileFormat: values.fileFormat,
                    materialId,
                    parentId
                };

                api.updateResources(params).then((res: IUpdateResourcesResponseResult) => {
                    if (res.status === 200 && res.data.success) {
                        this.props.callBack({ type: 'saveComplete' });
                        loading.success(res.data.desc);
                    } else {
                        loading.error(res.data.desc);
                    }
                });
            }
        });
    }

    public render() {
        const { source, location, treeModalVisible } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { sourceFormat = [], rules, sourceType = [] } = this.config;
        const treeModalProps: ITreeModalProps = {
            handleClick: this.handeTreeModalCallBack
        };
        console.log('渲染', source);

        return (
            <>
                <Form onSubmit={this.handleSubmit} className='souce-manage-modify-form' layout='vertical'>
                    <Row gutter={16}>
                        <Col xs={{span: 24}}>
                            <Item className='course-cover' label='封面'>
                                { this.buildOverLinkUploadNode() }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item label='标题'>
                                {
                                    getFieldDecorator('name', { initialValue: source.name, rules: rules.title })(
                                        <Input placeholder='请输入标题'/>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item label='资源简介'>
                                {
                                    getFieldDecorator('desc', { initialValue: source.desc, rules: rules.introduction })(
                                        <TextArea placeholder='请输入资源简介'/>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item label='课程章节'>
                                <Button type='primary' onClick={() => this.handleTreeModalClick(true)}>选择节点</Button>
                                { location && <span className='tree-node-location'>{location}</span> }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item label='资源类型'>
                                {
                                    getFieldDecorator('fileType', { initialValue: String(source.fileType), rules: rules.type })(
                                        <Radio.Group>
                                            {
                                                sourceType.map((type: IDictionaryItem, i: number) => {
                                                    return <Radio value={type.value} key={`radio-${i}`}>{type.name}</Radio>
                                                })
                                            }
                                        </Radio.Group>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item label='资源格式'>
                                {
                                    getFieldDecorator('fileFormat', { initialValue: String(source.fileFormat), rules: rules.format })(
                                        <Select placeholder='请选择资源格式'>
                                            {
                                                sourceFormat.map((format: IDictionaryItem, i: number) => {
                                                    return <Option value={format.value} key={`option-${i}`}>{format.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col xs={{span: 24}}>
                            <Item className='button-group'>
                                <Button type='primary' htmlType='submit' className='form-button'>保存</Button>
                                <Button onClick={this.cancel} className='form-button'>取消</Button>
                            </Item>
                        </Col>
                    </Row>
                </Form>
                <div>
                    { treeModalVisible && <TreeModalContainer {...treeModalProps}/> }
                </div>
            </>
        )
    }
}

export default Form.create()(modifySourceContainer);
