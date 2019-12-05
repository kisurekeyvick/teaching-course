export interface IMenuItem {
    title: string;
    path: string;
    key: string;
    tags: string;
    parentKey: string | null;
    children: IMenuItem[]
}

export const menu: IMenuItem[] = [
    {
        title: '资源上传',
        path: '/admin/system/upload',
        key: '1',
        tags: 'icon-upload-manage',
        parentKey: null,
        children: [
            {
                title: '资源上传',
                path: '/admin/system/upload',
                key: '1-1',
                tags: 'icon-upload-manage',
                parentKey: '1',
                children: []
            }
        ]
    },
    {
        title: '目录管理',
        path: '/admin/system/treeManage',
        key: '2',
        tags: 'icon-tree-manage',
        parentKey: null,
        children: []
    },
    {
        title: '资源管理',
        path: '/admin/system/sourceManage',
        key: '3',
        tags: 'icon-source-manage',
        parentKey: null,
        children: []
    },
    {
        title: '用户状态',
        path: '/admin/system/userManage',
        key: '4',
        tags: 'icon-user-manage',
        parentKey: null,
        children: []
    },
    {
        title: '系统状态',
        path: '/admin/system/state',
        key: '5',
        tags: 'icon-system-manage',
        parentKey: null,
        children: []
    }
];