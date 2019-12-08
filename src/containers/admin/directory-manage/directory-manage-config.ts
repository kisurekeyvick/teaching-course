export const columns = [
    {
        title: '课程名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: () => {},
        ellipsis: false
    },
];

export interface IConfig {
    columns: any[];
}

export interface ITableRecord {
    /** 和columns中的dataIndex有关 */
    name: string;
    key: string;
    isEdit?: boolean;    
    [key: string]: any;
}
