import * as React from 'react';
import { env } from 'environment/index';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSearchBook } from 'store/globalLayout/action';
import { IHeadMenu, headMenus, IConfig, menusContentConfig, IMenusContentConfig } from './index.config';
import { Link } from "react-router-dom";
import './index.scss';
import { Layout, Input, Icon, Popover, Row, Col, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import { LocalStorageItemName } from 'common/service/localStorageCacheList';
import LocalStorageService from 'common/utils/cache/local-storage';
import { EventEmitterList, globalEventEmitter } from 'common/utils/eventEmitter/list';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

type IGlobalLayoutProps = {
    children: any;
    searchBookContent: Function;
    [key: string]: any
}

class GlobalLayout extends React.Component<IGlobalLayoutProps, any> {
    public localStorageService: LocalStorageService;
    public config: IConfig;
    public childref: any;

    constructor(public props: IGlobalLayoutProps) {
        super(props);

        this.config = {
            headMenus:  cloneDeep(headMenus),
            menusContent: this.menusContentList(menusContentConfig),
        };

        this.localStorageService = new LocalStorageService();

        this.childref = React.createRef();
    }

    /** 
     * @func
     * @desc 搜索书名
     */
    public searchBook = (e: string) => {
        this.props.searchBookContent(e);

        console.log('this.props', this.props);

        if (window.location.pathname !== '/search/result') {
            /** 跳转至搜索结果页 */
            window.location.href = '/search/result';
        }

        globalEventEmitter.emit(EventEmitterList.SEARCHCOURSEEVENT, {
            searchBook: e
        });

        // console.log('全局的东西');
    }

    /** 
     * @func
     * @desc 构建头部菜单
     */
    public buildHeadMenu = (): React.ReactNode  => {
        return <React.Fragment>
                    {
                        this.config.headMenus.map((menu: IHeadMenu) => {
                            const content = this.config.menusContent[menu.value];

                            return <li className='menu-item' key={menu.key}>
                                { menu.type === 'icon' && content && <Popover content={content} trigger={menu.trigger}>
                                        <Icon type={menu.icon} onClick={() => this.clickHeadMenuItem(menu)}/>
                                    </Popover> }
                                { menu.type === 'icon' && !content && <Tooltip title={menu.tooltipInfo}>
                                                                        <Icon type={menu.icon} onClick={() => this.clickHeadMenuItem(menu)}/>
                                                                    </Tooltip> }
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
        if (menu.value === 'upload') {
            this.menuOperation(menu.value);
        }
    }

    /** 
     * @func
     * @desc 跳转
     */
    public menuOperation = (tag: string) => {
        if (tag === 'exit') {
            window.location.href = '/user/login';
        } else if (tag === 'personalSetting') {
            window.location.href = '/setting';
        } else if (tag === 'upload') {
            this.localStorageService.set(LocalStorageItemName.PAGETYPE, { type: 'behind' });
            window.location.href = '/admin/login';
        }
    }

    public render() {
        const headMenu: React.ReactNode = this.buildHeadMenu();

        return <Layout className='global-layout'>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className='global-head'>
                        <div className='global-head-left'>
                            <img alt='logo' src={env.pageLogo}/>
                            <Link className='link-item' to='/book'>课程资源</Link>
                            <Link className='link-item' to='/collection'>收藏</Link>
                            <Link className='link-item' to='/search/result'>检索</Link>
                        </div>
                        <div className='global-head-right'>
                            <Search className='search-control' placeholder='搜索教材' onSearch={this.searchBook}/>
                            <ul className='right-menu'>
                                { headMenu }
                            </ul>
                        </div>
                    </div>
                </Header>
                <Content>
                    <div className='global-body' >
                        { this.props.children }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    { env.footerText }
                </Footer>
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