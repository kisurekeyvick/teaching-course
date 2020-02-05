import { IQueryPersonDataResult } from 'common/api/api-interface';

export interface IUserModifyStepSecondProps {
    userInfo: IQueryPersonDataResult;
    eventEmitterFunc: Function;
    [key: string]: any;
}

export interface IFormItem {
    label: string;
    placeholder: string;
    controlName: string;
    controlType: string;
    rules?: any[];
    key: string;
    state: string;
}

export const formItem: IFormItem[] = [
    {
        label: '姓名',
        placeholder: '请输入姓名',
        controlName: 'input',
        controlType: 'text',
        key: '1',
        state: 'userName',
    },
    {
        label: '职位',
        placeholder: '请输入职位',
        controlName: 'input',
        controlType: 'text',
        key: '2',
        state: 'position',
    },
    {
        label: '个人简介',
        placeholder: '请输入个人简介',
        controlName: 'input',
        controlType: 'text',
        key: '3',
        state: 'desc',
    },
];

export interface IValue {
    userName: string;
    position: string;
    desc: string;
}
