export interface ITabItem {
    name: string;
    key: string;
    value: 'account' | 'detailInfo';
}

export const tabs: ITabItem[] = [
    {
        name: '账号密码',
        key: '1',
        value: 'account'
    },
    {
        name: '个人信息',
        key: '2',
        value: 'detailInfo'
    }
];
