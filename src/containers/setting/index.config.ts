export interface IHeadTab {
    name: string;
    key: string;
    value: string;
    selected: boolean;
}

export const headTabs: IHeadTab[] = [
    {
        name: '个人资料',
        key: '1',
        value: 'personal',
        selected: true
    },
    {
        name: '修改密码',
        key: '2',
        value: 'modifyPassword',
        selected: false
    }
];
