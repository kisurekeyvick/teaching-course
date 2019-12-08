import { IForm, LoginParams } from '../interface';

export const AdminLoginFormItem: IForm[] = [
    {
        label: '用户名',
        id: 1,
        key: 'userName',
        type: 'input',
        placeholder: '请输入用户名',
        size: 'large',
        config: {
            rule: [
                { required: true, message: '请输入用户名。' }
            ],
            type: 'text',
            icon: 'user',
            initialValue: undefined,
            hasFeedback: true
        }
    },
    {
        label: '密码',
        id: 2,
        key: 'password',
        type: 'input',
        placeholder: '请输入密码',
        size: 'large',
        config: {
            rule: [
                { required: true, message: '如忘记密码或无法登录，请联系开发人员。' }
            ],
            type: 'password',
            icon: 'lock',
            initialValue: undefined,
            hasFeedback: true
        }
    }
];

export interface IConfig {
    loginFormItem: IForm[];
}

export {
    LoginParams,
    IForm
}