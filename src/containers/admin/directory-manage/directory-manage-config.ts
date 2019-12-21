export const columns = [
    {
        title: '课程名',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        editable: true,
        width: '250px'
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: () => {},
        ellipsis: false,
        editable: false
    },
];

interface IOperationHistory {
    /** 操作类型 */
    type: string;
    /** 具体信息 */
    detail: any;
}

export interface IConfig {
    columns: any[];
    operationHistory: IOperationHistory
}

export interface ITableRecord {
    /** 和columns中的dataIndex有关 */
    name: string;
    key: string;
    value: string;
    isEdit?: boolean;
    id: number | null;
    children?: any[];
    desc: string;
    pic: string;
    contributors: string;
    score: string;
    size: string;
    type: string;
    weight: number;
    [key: string]: any;
}

/**
 * @func
 * @desc 添加课程字段的模板
 */
export const addCourseFieldTemplate = ({needChildren} = {needChildren: true}) => ({
    name: '请输入内容',
    key: `${Date.now()}`,
    value: '',
    weight: 10,
    loaded: true,
    id: null,
    desc: '',
    pic: '',
    contributors: '',
    score: '',
    size: '',
    type: '',
    ...needChildren && {children:[]}
});