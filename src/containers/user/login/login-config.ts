import { IForm } from '../interface';
export * from '../interface'; 

export const loginFormItem: IForm[] = [
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
                { required: true, message: '如忘记密码或无法登录，请联系系统管理员。' }
            ],
            type: 'password',
            icon: 'lock',
            initialValue: undefined,
            hasFeedback: true
        }
    },
    // {
    //     label: '验证码',
    //     id: 3,
    //     key: 'verificationImageCode',
    //     type: 'input',
    //     placeholder: '请输入验证码',
    //     config: {
    //         rule: [
    //             { required: true, message: '请输入验证码！' }
    //         ],
    //         type: 'text',
    //         icon: 'mail',
    //         initialValue: undefined,
    //         hasFeedback: true
    //     }
    // },
    {
        label: '记住密码',
        id: 4,
        key: 'remember',
        type: 'checkbox-group',
        config: {
            rule:[],
            initialValue: true,
            hasFeedback: false
        }
    }
];

