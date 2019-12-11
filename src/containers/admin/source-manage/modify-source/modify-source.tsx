import React from 'react';
import { Form, Button, Col, Row, Input, Select, Radio, message, Upload, Icon } from 'antd';
import { IFormParams, IConfig, rules, IModifySourceProps } from './modify-source.config';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import { api } from 'common/api/index';
import './modify-source.scss';

interface IState {
    fileList: any[];
    uploadControlError: boolean;
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
            sourceType: dictionary.get('source-type')!,
            sourceFormat: dictionary.get('source-format')!,
            fileLength: 1
        };

        this.state = {
            fileList: [],
            uploadControlError: false,
            loading: false
        };
    }

    /** 
     * @func
     * @desc 取消
     */
    public cancel = () => {
        this.props.callBack({ type: 'cancel' });
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
     * @func
     * @desc 文件发生改变
     */
    public handleFileChange = (info: any) => {
        this.setState({ 
            fileList: [...info.fileList],
            uploadControlError: info.fileList.length === 0
        });
    }

    public buildUploadNode = (): React.ReactNode => {
        const { fileList, uploadControlError, loading } = this.state;
        const showUploadList = {
            showPreviewIcon: false,
            showRemoveIcon: true,
            showDownloadIcon: false
        };
        const uploadButton: React.ReactNode = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
            </div>
        );
        const { fileLength } = this.config;

        return <>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        showUploadList={showUploadList}
                        multiple={true}
                        customRequest={this.mockUploadRequest}
                        onChange={this.handleFileChange}>
                        { fileList.length < fileLength && uploadButton}
                    </Upload>
                    { uploadControlError && <div className='ant-form-explain'>请上传教材封面</div> }
                </>
    }

    /** 
     * @func
     * @desc 验证特殊控件是否有效
     */
    public validSpecialControl = (): boolean => {
        const state: { uploadControlError: boolean } = { uploadControlError: false };

        state.uploadControlError = this.state.fileList.length === 0;

        this.setState({
            uploadControlError: state.uploadControlError
        });

        return !state.uploadControlError;
    }

    /** 
     * @func
     * @desc 提交表单
     */
    public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isvalid: boolean = this.validSpecialControl();

        this.props.form.validateFields((err: any, values: IFormParams) => {
            if (!err && isvalid) {
                this.props.callBack({ type: 'saveComplete' });
                message.success('保存成功！');
            }
        });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        const { sourceFormat = [], rules, sourceType = [] } = this.config;

        return (
            <Form onSubmit={this.handleSubmit} className='souce-manage-modify-form' layout='vertical'>
                <Row gutter={16}>
                    <Col xs={{span: 24}}>
                        <Item className='course-cover' label='封面'>
                            { this.buildUploadNode() }
                        </Item>
                    </Col>
                    <Col xs={{span: 24}}>
                        <Item label='标题'>
                            {
                                getFieldDecorator('title', {rules: rules.title})(
                                    <Input placeholder='请输入标题'/>
                                )
                            }
                        </Item>
                    </Col>
                    <Col xs={{span: 24}}>
                        <Item label='资源简介'>
                            {
                                getFieldDecorator('introduction', {rules: rules.introduction})(
                                    <TextArea placeholder='请输入资源简介'/>
                                )
                            }
                        </Item>
                    </Col>
                    <Col xs={{span: 24}}>
                        <Row gutter={16}>
                            <Col xs={{span: 10}}>
                                <Item label='所属课程'>
                                    {
                                        getFieldDecorator('name', {rules: rules.name})(
                                            <Input placeholder='请输入课程'/>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col xs={{span: 7}}>
                                <Item label='章节'>
                                    {
                                        getFieldDecorator('chapter', {rules: rules.chapter})(
                                            <Input placeholder='请输入章节'/>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col xs={{span: 7}}>
                                <Item label='小节'>
                                    {
                                        getFieldDecorator('section', {rules: rules.section})(
                                            <Input placeholder='请输入小节'/>
                                        )
                                    }
                                </Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{span: 24}}>
                        <Item label='资源类型'>
                            {
                                getFieldDecorator('type', {rules: rules.type})(
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
                                getFieldDecorator('format', {rules: rules.format})(
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
        )
    }
}

export default Form.create()(modifySourceContainer);
