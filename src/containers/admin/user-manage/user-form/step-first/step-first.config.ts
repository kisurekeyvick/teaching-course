import { IQueryPersonDataResult } from 'common/api/api-interface';

export interface IUserModifyStepFirstProps {
    operation: 'add' | 'edit' | null;
    successCallBack: Function;
    userInfo: IQueryPersonDataResult | null;
    // updateTime: number;
    [ket: string]: any;
}

export const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
    },
};

export const submitLayout = {
    wrapperCol: {
        sm: { span: 24 },
    },
};

export interface IFormItem {
    label: string;
    placeholder: string;
    controlName: string;
    controlType: string;
    rules: any[];
    key: string;
    state: string;
}

export const addAccount: IFormItem[] = [
    {
        label: '账号',
        placeholder: '请输入账号',
        controlName: 'input',
        controlType: 'text',
        rules: [
            {
                required: true,
                message: '请输入账号',
            }
        ],
        key: '1',
        state: 'loginName',
    },
    {
        label: '密码',
        placeholder: '请输入密码',
        controlName: 'input',
        controlType: 'password',
        rules: [
            {
                required: true,
                message: '请输入密码',
            }
        ],
        key: '2',
        state: 'password',
    },
];

export const modifyAccount: IFormItem[] = [
    {
        label: '旧密码',
        placeholder: '请输入原密码',
        controlName: 'input',
        controlType: 'password',
        rules: [
            {
                required: true,
                message: '输入原密码',
            }
        ],
        key: '1',
        state: 'oldPassword',
    },
    {
        label: '新密码',
        placeholder: '请输入新密码',
        controlName: 'input',
        controlType: 'password',
        rules: [
            {
                required: true,
                message: '请输入新密码',
            }
        ],
        key: '2',
        state: 'newPassword',
    },
    {
        label: '确认新密码',
        placeholder: '请再次输入新密码',
        controlName: 'input',
        controlType: 'password',
        rules: [
            {
                required: true,
                message: '请输入新密码',
            }
        ],
        key: '3',
        state: 'againNewPassword',
    }
];

export interface IModifyValue {
    oldPassword: string;
    newPassword: string;
    againNewPassword: string;
}

export interface IAddValue {
    loginName: string;
    password: string;
}
