import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import UserContainer from 'containers/user/user';
import BehindUserContainer from 'containers/admin/login/login';
import UserLayout from 'containers/globalLayout/userLayout/index';
import AdminLayout from 'containers/globalLayout/adminLayout/index';
import { pagesRouter, ILoadableRoute, behindPagesRouter } from './routerList';
import { localStorageService } from 'common/utils/function';
import { cloneDeep } from 'lodash';
import {connect} from 'react-redux';
import { StorageItemName } from 'common/utils/cache/storageCacheList';

type IProps = {
    [key: string]: any
}

type IConfig = {
    routes: ILoadableRoute[]
    behindRoutes: ILoadableRoute[]
};

class RouteClass extends React.Component<IProps, any> {
    public config: IConfig;

    constructor(public props: IProps) {
        super(props);

        this.config = {
            routes: cloneDeep(pagesRouter),
            behindRoutes: cloneDeep(behindPagesRouter) 
        };
    }

    /** 
     * @func
     * @desc 获取前台用户登录状态
     */
    public userStatus = (storageName: string) => {
        const userToken = localStorageService.get(storageName);
        return !(userToken && userToken['value']['token']);
    }

    /** 
     * @func
     * @desc 构建route页面
     */
    public buildPageRoute = (routes: ILoadableRoute[]):React.ReactNode[] => {
        return routes.map((route: ILoadableRoute, index: number) => {
            const rest: any = { }; 
            if (route.exact)
                rest.exact = route.exact;

            return <Route key={`route-` + route.key} {...rest} path={route.path} component={route.component}/>;
        });
    }

    /** 
     * TODO:
     * @func
     * @desc 判断是前台页面还是后台页面
     *       返回front 代表前台页面
     *       返回behind 代表后台页面
     */
    public judgePageType = (): string => {
        const pageType = localStorageService.get(StorageItemName.PAGETYPE);
        const result: string = pageType ? pageType.value['type'] : 'front';
        return result;
    }

    public render() {
        const pageType: string = this.judgePageType();
        const frontPageNeedLogin: boolean = this.userStatus(StorageItemName.TOKEN);
        const behindPageNeedLogin: boolean = this.userStatus(StorageItemName.BEHINDLOGINCACHE);
        const frontPageRoutes:React.ReactNode[] = this.buildPageRoute(this.config.routes);
        const behindPageRoutes:React.ReactNode[] = this.buildPageRoute(this.config.behindRoutes);

        return <React.Fragment>
                    {/** 前台路由 */
                        pageType === 'front' && 
                        <Router>
                            <Switch>
                                <Route exact={true} path='/user/:status' component={UserContainer}/>
                                { frontPageNeedLogin ? <Redirect from='/' to='/user/login'/> : <UserLayout>
                                    <Switch>
                                        { frontPageRoutes }
                                    </Switch>
                                </UserLayout> }
                            </Switch>
                        </Router>
                    }
                    {/** 后台路由 */
                        pageType === 'behind' &&
                        <Router>
                            <Switch>
                                <Route exact={true} path='/admin/:status' component={BehindUserContainer}/>
                                { behindPageNeedLogin ? <Redirect from='/' to='/admin/login'/> : <AdminLayout>
                                    <Switch>
                                        { behindPageRoutes }
                                    </Switch>
                                </AdminLayout> }
                            </Switch>
                        </Router>
                    }
                </React.Fragment>
    }
}

function mapStateToProps(state: any) {
    return {
        userInfo: state.userReducer && state.userReducer.userInfo
    }
}

export default connect(
    mapStateToProps
)(RouteClass);
