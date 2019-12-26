import * as React from 'react';
import { env } from 'environment/index';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSearchBook } from 'store/globalLayout/action';
import { IHeadMenu, headMenus, IConfig, menusContentConfig, IMenusContentConfig } from './index.config';
import { NavLink, Link } from "react-router-dom";
import { Layout, Icon, Popover, Row, Col, Tooltip, message, Divider, BackTop, Input } from 'antd';
import { cloneDeep } from 'lodash';
import { StorageItemName } from 'common/utils/cache/storageCacheList';
import { SvgComponent } from 'components/icon/icon';
import { ISignOutResponseResult } from 'common/api/api-interface';
import { api } from 'common/api/index';
import { getUserBaseInfo, localStorageService } from 'common/utils/function';
import { defaultUserPic, schoolLogo, userBannerBgPic } from 'common/service/img-collection';
import { globalEventEmitter, EventEmitterList } from 'common/utils/eventEmitter/list';
import './index.scss';

const { Header, Content, Footer } = Layout;

type IGlobalLayoutProps = {
    children: any;
    searchBookContent: Function;
    [key: string]: any;
}

interface IState {
    [key: string]: any;
    teacherCache: any;
}

const { Search } = Input;

class GlobalLayout extends React.Component<IGlobalLayoutProps, IState> {
    public config: IConfig;
    public childref: React.Ref<any>;

    constructor(public props: IGlobalLayoutProps) {
        super(props);

        this.config = {
            headMenus:  cloneDeep(headMenus),
            menusContent: this.menusContentList(menusContentConfig)
        };

        this.state = {
            teacherCache: getUserBaseInfo(),
        };

        this.childref = React.createRef();
    }

    public componentDidMount() {
        globalEventEmitter.on(EventEmitterList.USERINFOUPDATE, () => {
            let currentUserInfo = localStorageService.get(StorageItemName.LOGINCACHE);

            if (currentUserInfo && currentUserInfo.value) {
                this.setState({
                    teacherCache: currentUserInfo.value
                });
            }
        });
    }

    /** 
     * @func
     * @desc 构建头部菜单
     */
    public buildHeadMenu = (): React.ReactNode  => {
        const { teacherCache } = this.state;

        return <React.Fragment>
                    {
                        this.config.headMenus.map((menu: IHeadMenu) => {
                            const content = this.config.menusContent[menu.value];

                            return <li className={`menu-item ${menu.value}`} key={menu.key}>
                                { menu.type === 'icon' && content && <Popover content={content} trigger={menu.trigger}>
                                        <Icon type={menu.icon} onClick={() => this.clickHeadMenuItem(menu)}/>
                                    </Popover> }
                                { menu.type === 'icon' && !content && <Tooltip title={menu.tooltipInfo}>
                                                                        <Icon type={menu.icon} onClick={() => this.clickHeadMenuItem(menu)}/>
                                                                    </Tooltip> }
                                { menu.type === 'SvgComponent' && !content && <Tooltip title={menu.tooltipInfo}>
                                        <span className='menu-svg-box' onClick={() => this.clickHeadMenuItem(menu)}><SvgComponent className={`svg-component ${menu.icon}`} type={menu.icon!} /></span>
                                    </Tooltip> }
                                {
                                    menu.type === 'img' && content && <Popover placement='bottomRight' content={content} trigger={menu.trigger}>
                                        <img className='user-portrait' src={teacherCache.link || defaultUserPic} alt='user-img'/>
                                    </Popover>
                                }
                            </li>
                        })
                    }
                </React.Fragment>;
    }

    /** 
     * @func
     * @desc 头部菜单拓展内容
     */
    public menusContentList = (mcg: IMenusContentConfig) => {
        const user: React.ReactNode = <div className='global-container-popover-user'>
            <ul>
                <Row gutter={16}>
                    {
                        mcg.user.map((item: {name: string, value: string, key: string}) => {
                            return <Col key={item.key} xs={{span: 24}} md={{span: 12}}>
                                        <li key={`${item.key}-li`} onClick={() => this.menuOperation(item.value)}>{ item.name }</li>
                                    </Col>
                        })
                    }
                </Row>
            </ul>
        </div>;

        return {
            user
        }
    }

    /** 
     * @func
     * @desc 点击头部菜单
     */
    public clickHeadMenuItem = (menu: IHeadMenu) => {
        if (menu.value === 'admin-system') {
            this.menuOperation(menu.value);
        }
    }

    /** 
     * @func
     * @desc 跳转
     */
    public menuOperation = (tag: string) => {
        if (tag === 'exit') {
            /** 用户退出 */
            const loading = message.loading('正在退出中......', 0);

            const params: FormData = new FormData();
            params.set('teacherId', this.state.teacherCache.teacherId);

            api.signOut(params).then((res: ISignOutResponseResult) => {
                loading();

                if (res.status === 200) {
                    const { desc, success } = res.data;
                    
                    if (!success) {
                        message.error(desc);
                    } else {    
                        message.success(desc);
                        window.location.href = '/user/login';
                    }
                }
            });
        } else if (tag === 'personalSetting') {
            window.location.href = '/setting';
        } else if (tag === 'admin-system') {
            const { isAdministrators } = this.state.teacherCache;
            localStorageService.set(StorageItemName.PAGETYPE, { type: 'behind' });

            /** 如果是管理员 则直接跳转到上传界面 */
            if (isAdministrators) {
                window.location.href = 'admin/system/upload';
            } else {
                window.location.href = '/admin/login';
            }
        }
    }

    /** 
     * @callback
     * @desc 搜索资源
     */
    public handleSearch = (value: string) => {
        
    }

    public render() {
        const headMenu: React.ReactNode = this.buildHeadMenu();

        return <Layout className='global-layout'>
                <Header style={{ position: 'fixed', zIndex: 100, width: '100%' }}>
                    <div className='global-head'>
                        <img className='banner-bg' alt='banner-bg' src={userBannerBgPic}/>
                        <div className='global-head-left'>
                            <Link className='logo-link-home' to='/book'/>
                            <img alt='logo' src={schoolLogo} />
                        </div>
                        <div className='global-head-right'>
                            <NavLink className='link-item' to='/book' activeClassName='selected'>课程资源</NavLink>
                            <NavLink className='link-item' to='/collection' activeClassName='selected'>收藏</NavLink>
                            <NavLink className='link-item' to='/search' activeClassName='selected'>检索</NavLink>
                            <Search className='global-search-material' placeholder='搜索课程资源' onSearch={this.handleSearch}/>
                            <Divider type="vertical" />
                            <ul className='right-menu'>
                                { headMenu }
                            </ul>
                        </div>
                    </div>
                </Header>
                <Content>
                    <div className='global-body' ref={this.childref}>
                        { this.props.children }
                    </div>
                    <Footer style={{ textAlign: 'center' }}>
                        { env.footerText }
                    </Footer>
                </Content>
                <BackTop />
            </Layout>
                
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {
        searchBookContent: bindActionCreators(updateSearchBook, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GlobalLayout);