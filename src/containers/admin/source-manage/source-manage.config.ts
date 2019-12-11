export const columns = [
    {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: '200px',
    },
    {
        title: '资源类型',
        dataIndex: 'typeName',
        key: 'typeName',
        width: '100px',
        ellipsis: true
    },
    {
        title: '资源简介',
        dataIndex: 'desc',
        key: 'desc',
        ellipsis: true
    },
    {
        title: '创建人',
        dataIndex: 'creater',
        key: 'creater',
        width: '100px',
        ellipsis: true
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: () => {},
        width: '180px',
        ellipsis: true,
        editable: false
    }
];

export interface IConfig {
    columns: any[];
}

export interface ITableRecord {
    name: string;
    key: string;
    type: number | string;
    typeName: string;
    creater: string;
    desc: string;
    id: number;
    [key: string]: any;
}
