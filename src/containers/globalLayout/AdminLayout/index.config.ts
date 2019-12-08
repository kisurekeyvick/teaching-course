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
    menuList: IMenuItem[]
}
