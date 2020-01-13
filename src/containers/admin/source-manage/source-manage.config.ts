import { dictionary, IDictionaryItem } from 'common/dictionary/index';

export const columns = [
    {
        title: '资源名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 150,
    },
    {
        title: '资源类型',
        dataIndex: 'typeName',
        key: 'typeName',
        width: 50,
        ellipsis: true
    },
    {
        title: '资源简介',
        dataIndex: 'desc',
        key: 'desc',
        width: 350,
        ellipsis: true
    },
    {
        title: '创建人',
        dataIndex: 'contributors',
        key: 'contributors',
        width: 80,
        ellipsis: true
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: () => {},
        fixed: 'right',
        width: 270,
        editable: false
        // width: '180px',
        // ellipsis: true,
    }
];

export interface IConfig {
    columns: any[];
    sourceFormat: IDictionaryItem[];
}

export const sourceFormat: IDictionaryItem[] = dictionary.get('source-format')!;

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
