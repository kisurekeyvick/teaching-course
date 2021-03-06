import { IMenuItem } from 'common/admin-menu/menu';

export interface IAdminLayoutProps {
    [key: string]: any;
}

export interface IAdminLayoutState {
    collapsed: boolean;
    breadcrumb: IMenuItem[];
    [key: string]: any;
}

export interface IConfig {
    menuList: IMenuItem[];
    userMenuList: IHeadMenu[];
    userCommonMenuList: IHeadMenu[];
    teacherCache: any;
}

export interface IHeadMenu {
    icon?: string;
    key: string;
    type: string;
    value: string;
    trigger?: "hover" | "focus" | "click" | "contextMenu" | undefined;
    context: string;
}

export const userCommonMenuList: IHeadMenu[] = [
    {
        icon: 'icon-skip-page',
        key: '1',
        type: 'SvgComponent',
        value: 'skip-to-user-system',
        trigger: 'click',
        context: '切换至首页'
    }
];

export const userMenuList: IHeadMenu[] = [
    {
        icon: 'icon-switch-account',
        key: '1',
        type: 'SvgComponent',
        value: 'changeAdmin',
        trigger: 'click',
        context: '切换管理员账号'
    },
    {
        icon: 'icon-exit',
        key: '2',
        type: 'SvgComponent',
        value: 'exit',
        trigger: 'click',
        context: '退出系统'
    }
];
