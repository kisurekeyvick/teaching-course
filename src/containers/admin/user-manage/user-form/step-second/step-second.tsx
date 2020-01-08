import React from 'react';
import { Form, Button, Input } from 'antd';
import { api } from 'common/api/index';
import { IUserModifyStepSecondProps, IValue, IFormItem, formItem } from './step-second.config';
import { messageFunc } from 'common/utils/function';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import { formItemLayout, submitLayout } from '../step-first/step-first.config';
import { defaultUserPic } from 'common/service/img-collection';
import { IPersonUpdateRequestParams, IPersonUpdateResponseResult } from 'common/api/api-interface';
import './step-second.scss';

interface IState {
    img: any
    [key: string]: any;
}

interface IConfig {
    uploadPicFormat: string[];
}

class UserModifyStepSecondContainer extends React.PureComponent<IUserModifyStepSecondProps, IState> {
    public config: IConfig;

    constructor(public props: IUserModifyStepSecondProps) {
        super(props);

        this.state = {
            img: defaultUserPic
        };

        this.config = {
            uploadPicFormat: [...dictionary.get('upload-pic-format')!].map((item: IDictionaryItem) => {
                return String(item.value);
            })
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
     * @desc 构建表单
     */
    public createForm = (formItems: IFormItem[]): React.ReactNode => {
        const { getFieldDecorator } = this.props.form;
        const { userInfo } = this.props;
        const souce: any = {
            ...userInfo && {
                userName: userInfo.userName,
                position: userInfo.position,
                desc: userInfo.desc
            }
        };

        return <>
            {
                formItems.map((item: IFormItem) => {
                    const Control: React.ReactNode = ((): React.ReactNode => {
                        let control: React.ReactNode = <div></div>;

                        if (item.controlName === 'input') {
                            item.controlType === 'text' && (control = <Input placeholder={item.placeholder}/>);

                            item.controlType === 'password' && (control = <Input.Password placeholder={item.placeholder}/>)

                            return control;
                        }

                        return control;
                    })();

                    return <Form.Item className='user-modify-step-first-form-item' label={item.label} key={item.key}>
                                {
                                    getFieldDecorator(item.state, {
                                        initialValue: souce[item.state] || '',
                                        rules: item.rules
                                    })(Control)
                                }
                            </Form.Item>
                })
            }
        </>
    }

    /** 
     * @callback
     * @desc 保存
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err: any, values: IValue) => {
            if (!err) {
                const loading = messageFunc('开始更新信息...');

                const { loginName, password, teacherId } = this.props.userInfo;
                const params: IPersonUpdateRequestParams = {
                    loginName,
                    password,
                    position: values.position,
                    userName: values.userName,
                    desc: values.desc,
                    teacherId
                };

                api.updateTeacher(params).then((res: IPersonUpdateResponseResult) => {
                    if (res.status === 200 && res.data.success) {
                        loading.success(res.data.desc);
                        this.props.eventEmitterFunc();
                    } else {
                        loading.error(res.data.desc);
                    }
                });
            }
        });
    }

    public render() {
        return <div className='user-modify-step-second'>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    { this.createForm(formItem) }
                    <Form.Item {...submitLayout} className='submit-control'>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    }
}

export default Form.create()(UserModifyStepSecondContainer);
