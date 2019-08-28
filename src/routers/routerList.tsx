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