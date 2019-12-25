import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { IFormItem, formItems, ISettingModifyPwdProps, IValue } from './index.config';
import { cloneDeep } from 'lodash';
import { api } from 'common/api/index';
import { IPersonUpdateResponseResult, IUpdatePasswordRequestParams } from 'common/api/api-interface';
import { messageFunc, relogin } from 'common/utils/function';
import './index.scss';

interface IConfig {
    formItems: IFormItem[];
    // teacherCahe: any;
}

interface IState {
    [key: string]: any;
}

class SettingModifyPwdContainer extends React.PureComponent<ISettingModifyPwdProps, IState> {
    public config: IConfig;

    constructor(public props: any) {
        super(props);

        this.config = {
            formItems: this.rebuildFormItem(cloneDeep(formItems)),
            // teacherCahe: getUserBaseInfo()
        }
    }

    /** 
     * @func
     * @desc 重新构造form表单配置
     */
    public rebuildFormItem = (formItems: IFormItem[]): IFormItem[] => {
        return formItems.map((item: IFormItem) => {
            if (item.state === 'secondNewPwd') {
                item.rules.push({
                    validator: this.validateSamePwd
                })
            }

            return item;
        });
    }

    /** 
     * @func
     * @desc 输入框离开，触发事件
     */
    public inputOnBlur = (e: any, stateName: string) => {
        
    }

    public validateSamePwd = (rule: any, value: any, callback: any) => {
        const { getFieldValue } = this.props.form;
        const newPwd: string = getFieldValue('newPwd');

        value === '' && callback('');

        value !== newPwd && callback('密码不一致');

        callback();
    }

    /** 
     * @func
     * @desc 表单提交
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err: any, values: IValue) => {
            if (!err) {
                const loading = messageFunc('正在修改密码中......');

                const params: IUpdatePasswordRequestParams = {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    againNewPassword: values.againNewPassword,
                };

                api.updatePassword(params).then((res: IPersonUpdateResponseResult) => {
                    if (res.status === 200 && res.data.success) {
                        loading.success('密码修改成功！');
                        relogin();
                    } else {
                        loading.error(res.data.desc, 4);
                    }
                });
            }
        });
    }

    /** 
     * @func
     * @desc 构建表单
     */
    public createForm = (formItems: IFormItem[]): React.ReactNode => {
        const { getFieldDecorator } = this.props.form;
        
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
        const submitLayout = {
            wrapperCol: {
                sm: { span: 24 },
            },
        };

        return <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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

                    return <Form.Item className='modify-pwd-form-item' label={item.label} key={item.key}>
                                {
                                    getFieldDecorator(item.state, {
                                        rules: item.rules
                                    })(Control)
                                }
                            </Form.Item>
                })
            }
            <Form.Item {...submitLayout} className='submit-control'>
                <Button type="primary" htmlType="submit">
                    保存修改
                </Button>
            </Form.Item>
        </Form>;
    }

    public render() {
        return <div className='setting-modifyPwd-box animateCss'>
                    <p className='title'>修改密码</p>
                    <div className='form'>
                        { this.createForm(this.config.formItems) }
                    </div>
                </div>  
    }
}

export default Form.create()(SettingModifyPwdContainer);
