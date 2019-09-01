import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import { env } from 'environment/index';
import UserContainer from 'containers/user/user';
import GlobalLayout from 'containers/globalLayout/index';
import { pagesRouter, ILoadableRoute } from './routerList';
import LocalStorageService from 'common/utils/cache/local-storage';
import * as _ from 'lodash';
import {connect} from 'react-redux';

type IProps = {
    [key: string]: any
}

type IConfig = {
    routes: ILoadableRoute[]
};

class RouteClass extends React.Component<IProps, any> {
    public config: IConfig;
    public localStorageService: LocalStorageService;

    constructor(public props: IProps) {
        super(props);

        this.config = {
            routes: _.cloneDeep(pagesRouter)
        };

        this.localStorageService = new LocalStorageService();
    }

    /** 
     * @func
     * @desc 获取用户登录状态
     */
    public userStatus = () => {
        const userInfo = this.localStorageService.get('userInfo');
        return !(userInfo && userInfo['value']['token']);
    }

    /** 
     * @func
     * @desc 构建route页面
     */
    public buildPageRoute = ():React.ReactNode[] => {
        return this.config.routes.map((route: ILoadableRoute, index: number) => {
            const rest: any = { }; 
            if (route.exact)
                rest.exact = route.exact;

            return <Route key={`route-` + route.key} {...rest} path={route.path} component={route.component}/>;
        });
    }

    public render() {
        const needLogin = this.userStatus();
        const routes:React.ReactNode[] = this.buildPageRoute();

        return <React.Fragment>
                    <Router>
                        <Switch>
                            <Route exact={true} path='/user/:status' component={UserContainer}/>
                            { needLogin ? <Redirect from='/' to='/user/login'/> : <GlobalLayout>
                                <Switch>
                                    { routes }
                                </Switch>
                            </GlobalLayout> }
                        </Switch>
                    </Router>
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
