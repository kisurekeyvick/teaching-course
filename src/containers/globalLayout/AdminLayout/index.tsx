import * as React from 'react';
import { env } from 'environment/index';
import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import { menu, IMenuItem } from 'common/admin-menu/menu';
import { SvgComponent } from 'components/icon/icon';
import { Link } from "react-router-dom";
import './index.scss';
import { cloneDeep } from 'lodash';
import { IAdminLayoutProps, IAdminLayoutState, IConfig } from './index.config';

const { SubMenu } = Menu;
const { Header, Sider, Content, Footer } = Layout;

class AdminLayout extends React.Component<IAdminLayoutProps, IAdminLayoutState> {
    public config: IConfig; 

    constructor(public props: IAdminLayoutProps) {
        super(props);

        this.config = {
            menuList: cloneDeep(menu)
        };

        this.state = {
            collapsed: false,
            breadcrumb: this.initBreadcrumbInfo()
        };
    }

    public componentDidMount() {

    }

    public initBreadcrumbInfo = (): IMenuItem[] => {
        const pathname: string = window.location.pathname;
        const menuLists: IMenuItem[] = this.config.menuList;
        const result: IMenuItem[] = [];

        for (let i = 0; i < menuLists.length; i++) {
            if (menuLists[i].path.includes(pathname)) {
                result.push(menuLists[i]);
                break;
            }
        }

        return result;
    }

    /**
     * @func
     * @desc 折页开关
     */
    public toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };

    /** 
     * @func
     * @desc 构建左侧菜单
     */
    public buildMenu = (): React.ReactNode => {
        const mapFunc = (item: IMenuItem) => {
            if (item.children.length > 0) {
                return <SubMenu key={item.key} title={
                            <span>
                                { item.tags && <SvgComponent className={`svg-icon ${item.tags}`} type={item.tags} /> }
                                { item.title }
                            </span>}
                        >
                            {
                                item.children.map((i: IMenuItem) => {
                                    return mapFunc(i);
                                })
                            }
                        </SubMenu>
            } else {
                return <Menu.Item key={item.key} onClick={() => this.updateBreadcrumbInfo(item)}>
                            <Link to={item.path}>
                                <SvgComponent className={`svg-icon ${item.tags}`} type={item.tags} />
                                { !this.state.collapsed ? item.title : <span>{item.title}</span>}
                            </Link>
                        </Menu.Item>
            }
        }

        return menu.map((item: IMenuItem) => {
            return mapFunc(item);
        });
    }

    /** 
     * @callback
     * @desc 更新面包屑数据
     */
    public updateBreadcrumbInfo = (item: IMenuItem) => {
        const result: IMenuItem[] = [];
        const keys: string[] = item.key.split('-');
        const repeatKeys = (currentMenu: IMenuItem[], keysIndex: number = 0) => {
            const matchKeys: string = keys.slice(0, keysIndex + 1).join('-');
            const target = currentMenu.find((menu: IMenuItem) => menu.key === matchKeys);
            target && (result.push(target));

            if (target && keys.length > keysIndex + 1 && target.children.length > 0) {
                repeatKeys(target.children, keysIndex + 1);
            }
        };

        repeatKeys(this.config.menuList);

        this.setState({
            breadcrumb: result
        });
    }

    /** 
     * @func
     * @desc 构建面包屑
     */
    public reateBreadcrumb = (): React.ReactNode => {
        return <Breadcrumb>
                    {
                        this.state.breadcrumb.map((item: IMenuItem) => {
                            return <Breadcrumb.Item key={item.key}>{ item.title }</Breadcrumb.Item>
                        })
                    }
                </Breadcrumb>
    }

    public render() {
        const menuList: React.ReactNode = this.buildMenu();
        const bread: React.ReactNode = this.reateBreadcrumb();

        return <Layout className='admin-layout'>
                    <Sider style={{
                                overflow: 'auto',
                                height: '100vh',
                            }}
                            className={`slide-coantainer ${this.state.collapsed ? 'collapsed' : ''}`} trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className='slide-logo-box'>
                            <img className='slide-logo' alt='slide-logo' src={this.state.collapsed ? env.simpleLogo : env.siderLogo} />
                        </div>
                        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
                            { menuList }
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0}}>
                            <Icon
                            className='trigger'
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle} />
                        </Header>
                        <Content>
                            <div className='admin-bread-box'>
                                <SvgComponent className='svg-icon' type='icon-breadcrumb' />
                                { bread }
                            </div>
                            <div className='admin-body' >
                                { this.props.children }
                            </div>
                            <Footer className={`admin-foot ${this.state.collapsed ? 'collapsed' : ''}`} style={{ textAlign: 'center' }}>
                                { env.footerText }
                            </Footer>
                        </Content>
                    </Layout>
                </Layout>
    }
}

function mapStateToProps() {
    return {};
}

// function mapDispatchToProps(dispatch: any) {
//     return {
//     }
// }

export default connect(
    mapStateToProps
)(AdminLayout);