export interface ITabItem {
    name: string;
    key: string;
    value: 'selectNode' | 'upload' | 'complete';
}

export const tabs: ITabItem[] = [
    {
        name: '填写信息',
        key: '1',
        value: 'selectNode'
    },
    {
        name: '上传文件',
        key: '2',
        value: 'upload'
    },
    {
        name: '完成上传',
        key: '3',
        value: 'complete'
    }
];
