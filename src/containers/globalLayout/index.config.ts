export interface IHeadMenu {
    icon?: string;
    key: string;
    type: string;
    value: string;
    trigger?: "hover" | "focus" | "click" | "contextMenu" | undefined;
    tooltipInfo?: string;
}

export const headMenus: IHeadMenu[] = [
    {
        icon: 'icon-admin-system',
        key: '3',
        type: 'SvgComponent',
        value: 'admin-system',
        trigger: 'click',
        tooltipInfo: '后台管理'
    },
    // {
    //     icon: 'bell',
    //     key: '2',
    //     type: 'icon',
    //     value: 'bell',
    //     trigger: 'hover',
    //     tooltipInfo: '消息提醒'
    // },
    {
        icon: 'user',
        key: '1',
        type: 'icon',
        value: 'user',
        trigger: 'hover',
        tooltipInfo: '个人中心'
    }
];

export interface IConfig {
    headMenus: IHeadMenu[];
    menusContent: {
        [key: string]: React.ReactNode
    };
    [key: string]: any;
};

export interface IMenusContentConfig {
    user: Array<{ name: string, value: string, key: string }>
};

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
};
