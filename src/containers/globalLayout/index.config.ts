export interface IHeadMenu {
    icon?: string;
    key: string;
    type: string;
    value: string;
    trigger?: "hover" | "focus" | "click" | "contextMenu" | undefined;
}

export const headMenus: IHeadMenu[] = [
    {
        icon: 'upload',
        key: '3',
        type: 'icon',
        value: 'upload',
        trigger: 'click'
    },
    {
        icon: 'bell',
        key: '2',
        type: 'icon',
        value: 'bell',
        trigger: 'hover'
    },
    {
        icon: 'user',
        key: '1',
        type: 'icon',
        value: 'user',
        trigger: 'hover'
    }
];

export interface IConfig {
    headMenus: IHeadMenu[];
    menusContent: {
        [key: string]: React.ReactNode
    };
    [key: string]: any;
}

export interface IMenusContentConfig {
    user: Array<{ name: string, value: string, key: string }>
}

export const menusContentConfig = {
    user: [
        {
            name: '个人设置',
            value: 'personalSetting',
            key: '1'
        },
        {
            name: '退出',
            value: 'exit',
            key: '2'
        }
    ]
}