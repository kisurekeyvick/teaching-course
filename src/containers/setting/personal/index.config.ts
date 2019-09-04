export interface IStoreState {
    userName: string;
    job: string;
    introduction: string;
    [key: string]: any;
}

export interface IControl {
    name: string;
    className: string;
    stateName: string;
    focusStateName: string;
    key: string;
    placeholder: string;
}

export const controlArray: IControl[] = [
    {
        name: '用户名',
        className: 'head-portrait',
        stateName: 'userName',
        focusStateName: 'userNameControlFocus',
        key: '1',
        placeholder: '请输入用户名'
    },
    {
        name: '职位',
        className: 'job',
        stateName: 'job',
        focusStateName: 'jobControlFocus',
        key: '2',
        placeholder: '请输入职位'
    },
    {
        name: '个人介绍',
        className: 'introduction',
        stateName: 'introduction',
        focusStateName: 'introductionControlFocus',
        key: '3',
        placeholder: '请输入个人介绍'
    }
]
