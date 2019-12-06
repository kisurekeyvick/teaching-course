import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import { env } from 'environment/index';
import UserContainer from 'containers/user/user';
import BehindUserContainer from 'containers/admin/login/login';
import UserLayout from 'containers/globalLayout/index';
import AdminLayout from 'containers/globalLayout/AdminLayout/index';
import { pagesRouter, ILoadableRoute, behindPagesRouter } from './routerList';
import LocalStorageService from 'common/utils/cache/local-storage';
import { LocalStorageItemName } from 'common/service/localStorageCacheList';
import { cloneDeep } from 'lodash';
import {connect} from 'react-redux';

type IProps = {
    [key: string]: any
}

type IConfig = {
    routes: ILoadableRoute[]
    behindRoutes: ILoadableRoute[]
};

class RouteClass extends React.Component<IProps, any> {
    public config: IConfig;
    public localStorageService: LocalStorageService;

    constructor(public props: IProps) {
        super(props);

        this.config = {
            routes: cloneDeep(pagesRouter),
            behindRoutes: cloneDeep(behindPagesRouter) 
        };

        this.localStorageService = new LocalStorageService();
    }

    /** 
     * @func
     * @desc 获取前台用户登录状态
     */
    public userStatus = (storageName: string) => {
        const userInfo = this.localStorageService.get(storageName);
        return !(userInfo && userInfo['value']['token']);
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
        const pageType = this.localStorageService.get(LocalStorageItemName.PAGETYPE);
        const result: string = pageType ? pageType.value['type'] : 'front';
        return result;
    }

    public render() {
        const pageType: string = this.judgePageType();
        const frontPageNeedLogin: boolean = this.userStatus(LocalStorageItemName.LOGINCACHE);
        const behindPageNeedLogin: boolean = this.userStatus(LocalStorageItemName.BEHINDLOGINCACHE);
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
