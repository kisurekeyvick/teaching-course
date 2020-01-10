import Loadable from 'react-loadable';
import { ILoadableRoute } from './interface';
import LoadingComponent from 'components/loading/index';

/** 前台用户登录 */
export const userRouter: ILoadableRoute[] = [
    {
        path: '/user/:status',
        component: Loadable({
            loader: () => import('../containers/user/user'),
            loading: LoadingComponent,
            modules: ['user']
        }),
        key: 1,
        exact: true
    }
];

/** 前台用户路由 */
export const pagesRouter: ILoadableRoute[] = [
    {
        path: '/book',
        component: Loadable({
            loader: () => import('../containers/user/book/index'),
            loading: () => null,
            modules: ['book']
        }),
        key: 2,
        exact: true
    },
    {
        path: '/setting',
        component: Loadable({
            loader: () => import('../containers/user/setting/index'),
            loading: () => null,
            modules: ['setting']
        }),
        key: 3,
        exact: true
    },
    {
        path: '/search',
        component: Loadable({
            loader: () => import('../containers/user/search-result/search-result'),
            loading: () => null,
            modules: ['searchResult']
        }),
        key: 5,
        exact: true
    },
    {
        path: '/collection',
        component: Loadable({
            loader: () => import('../containers/user/collection/collection'),
            loading: () => null,
            modules: ['collection']
        }),
        key: 5,
        exact: true
    },
    {
        path: '',
        component: Loadable({
            loader: () => import('../containers/user/exception/index'),
            loading: () => null,
            modules: ['exception']
        }),
        key: 300,
        exact: true
    }
];

/** 后台用户登录 */
export const behindUserRouter: ILoadableRoute[] = [
    {
        path: '/admin/:status',
        component: Loadable({
            loader: () => import('../containers/admin/login/login'),
            loading: () => null,
            modules: ['admin']
        }),
        key: 1,
        exact: true
    }
];

/** 后台用户路由 */
export const behindPagesRouter: ILoadableRoute[] = [
    {
        path: '/admin/system/upload',
        component: Loadable({
            loader: () => import('../containers/admin/source-upload/source-upload-steps'),
            loading: () => null,
            modules: ['upload']
        }),
        key: 2,
        exact: true
    },
    {
        path: '/admin/system/directoryManage',
        component: Loadable({
            loader: () => import('../containers/admin/directory-manage/directory-manage-table'),
            loading: () => null,
            modules: ['directoryManage']
        }),
        key: 3,
        exact: true
    },
    {
        path: '/admin/system/sourceManage',
        component: Loadable({
            loader: () => import('../containers/admin/source-manage/source-manage'),
            loading: () => null,
            modules: ['sourceManage']
        }),
        key: 4,
        exact: true
    },
    {
        path: '/admin/system/userManage',
        component: Loadable({
            loader: () => import('../containers/admin/user-manage/user-manage'),
            loading: () => null,
            modules: ['userManage']
        }),
        key: 5,
        exact: true
    },
    {
        path: '/admin/system/state',
        component: Loadable({
            loader: () => import('../containers/admin/system-status/system-status'),
            loading: () => null,
            modules: ['systemStatus']
        }),
        key: 6,
        exact: true
    },
    {
        path: '',
        component: Loadable({
            loader: () => import('../containers/admin/exception/index'),
            loading: () => null,
            modules: ['exception']
        }),
        key: 300,
        exact: true
    }
];

export type ILoadableRoute = ILoadableRoute;