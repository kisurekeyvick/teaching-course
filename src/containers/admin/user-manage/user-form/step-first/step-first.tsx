import React from 'react';
import { Button, Input, Form } from 'antd';
import { formItemLayout, submitLayout, addAccount, modifyAccount, IFormItem, 
        IUserModifyStepFirstProps, IModifyValue, IAddValue } from './step-first.config';
import { api } from 'common/api/index';
import { messageFunc } from 'common/utils/function';
import { IPersonUpdateResponseResult, IUpdatePasswordRequestParams, IUserRegisterRequestParams,
        IUserRegisterResponseResult } from 'common/api/api-interface';
import './step-first.scss';

interface IState {
    [ket: string]: any;
}

class UserModifyStepFirstContainer extends React.PureComponent<IUserModifyStepFirstProps, IState> {
    constructor(public props: IUserModifyStepFirstProps) {
        super(props);
    }

    /** 
     * @callback
     * @desc 保存
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();
        const { operation } = this.props;

        this.props.form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {
                operation === 'add' && this.addAccount(values);
                operation === 'edit' && this.modifyAccount(values);
            }
        });
    }

    /** 
     * @func
     * @desc 新建账号
     */
    public addAccount = (values: IAddValue) => {
        const loading = messageFunc('正在新建账号中......');
        const params: IUserRegisterRequestParams = {
            loginName: values.loginName,
            password: values.password
        };

        api.register(params).then((res: IUserRegisterResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success('账号创建成功！');
                this.props.successCallBack(res.data.result);
            } else {
                loading.error(res.data.desc, 4);
            }
        });
    }

    /** 
     * @func
     * @desc 修改账号
     */
    public modifyAccount = (values: IModifyValue) => {
        const loading = messageFunc('正在修改密码中......');
        const { userInfo } = this.props;
        const params: IUpdatePasswordRequestParams = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            againNewPassword: values.againNewPassword,
            teacherId: (userInfo!).teacherId
        };

        api.updatePassword(params).then((res: IPersonUpdateResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success('密码修改成功！');
                this.props.successCallBack();
            } else {
                loading.error(res.data.desc, 4);
            }
        });
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
                oldPassword: userInfo.password
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

    public render() {
        const { operation } = this.props;

        return <div className='user-modify-step-first'>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    { operation === 'add' && this.createForm(addAccount) }
                    { operation === 'edit' && this.createForm(modifyAccount) }
                    <Form.Item {...submitLayout} className='submit-control'>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
        </div>
    }
}

export default Form.create()(UserModifyStepFirstContainer);