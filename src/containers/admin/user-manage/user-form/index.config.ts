export interface ITabItem {
    name: string;
    key: string;
    value: 'account' | 'detailInfo';
}

export const tabs: ITabItem[] = [
    {
        name: '修改用户密码',
        key: '1',
        value: 'account'
    },
    {
        name: '修改个人信息',
        key: '2',
        value: 'detailInfo'
    }
];
