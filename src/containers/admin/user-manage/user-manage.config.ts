export const columns = [
    {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,
        width: 200,
    },
    {
        title: '登录名',
        dataIndex: 'loginName',
        key: 'loginName',
        ellipsis: true,
        width: 200,
    },
    {
        title: '职位',
        dataIndex: 'position',
        key: 'position',
        ellipsis: true,
        width: 150,
    },
    {
        title: '个人简介',
        dataIndex: 'desc',
        key: 'desc',
        ellipsis: true,
        width: 200,
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        ellipsis: true,
        width: 150,
    },
    {
        title: '操作',
        dataIndex: 'operation',
        render: () => {},
        fixed: 'right',
        width: 180,
        editable: false
        // width: '180px',
        // ellipsis: true,
    }
];

export interface IConfig {
    columns: any[];
}
