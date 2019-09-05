import Loadable from 'react-loadable';
import { ILoadableRoute } from './interface';

export const userRouter: ILoadableRoute[] = [
    {
        path: '/user/:status',
        component: Loadable({
            loader: () => import('../containers/user/user'),
            loading: () => null,
            modules: ['user']
        }),
        key: 1,
        exact: true
    }
];

export const pagesRouter: ILoadableRoute[] = [
    {
        path: '/book',
        component: Loadable({
            loader: () => import('../containers/book/index'),
            loading: () => null,
            modules: ['book']
        }),
        key: 2,
        exact: true
    },
    {
        path: '/setting',
        component: Loadable({
            loader: () => import('../containers/setting/index'),
            loading: () => null,
            modules: ['setting']
        }),
        key: 3,
        exact: true
    },
    {
        path: '/upload',
        component: Loadable({
            loader: () => import('../containers/upload/index'),
            loading: () => null,
            modules: ['upload']
        }),
        key: 4,
        exact: true
    },
    {
        path: '/book/detail',
        component: Loadable({
            loader: () => import('../containers/book/list/detail/index'),
            loading: () => null,
            modules: ['bookDetail']
        }),
        key: 4,
        exact: true
    },
    {
        path: '',
        component: Loadable({
            loader: () => import('../containers/exception/index'),
            loading: () => null,
            modules: ['exception']
        }),
        key: 300,
        exact: true
    }
];

export type ILoadableRoute = ILoadableRoute;