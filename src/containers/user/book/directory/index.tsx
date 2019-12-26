import * as React from 'react';
import { IDirectoryProps } from '../interface';
import { Tree, Skeleton } from 'antd';
import './index.scss';
// menu是本地写死的数据
import { IMenuItem } from './index.config';
import { SvgComponent } from 'components/icon/icon';
// import { api } from 'common/api/index';
import noDataImg from 'assets/images/noData.png';
import { IMaterialStatusRequest, IMaterialStatusResponse, ITeachChapterList } from 'common/api/api-interface';
import { loadMaterialMenu, loadSectionList, matchOutermostLayerKey } from 'common/service/tree-ajax';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateChapterMaterial } from 'store/material-chapter/action';
import { messageFunc } from 'common/utils/function';
import { api } from 'common/api';

const { TreeNode } = Tree;

interface IState {
    menus: IMenuItem[];
    hasData: boolean;
    isLoading: boolean;
}

interface IConfig {
}

class DirectoryContainer extends React.PureComponent<IDirectoryProps, IState> {
    public config: IConfig;

    constructor(public props: IDirectoryProps) {
        super(props);
    
        this.state = {
            menus: [],
            hasData: false,
            isLoading: false
        };

        this.config = {
        };
    }

    /** 
     * @func
     * @desc 加载最外层级目录菜单
     */
    public loadFirstLayerMenu = () => {
        const loading = messageFunc();

        this.setState({
            isLoading: true
        });

        loadMaterialMenu().then((res: IMenuItem[]) => {
            let state = {
                isLoading: false
            };
            
            res.length && (state = {...state, ...{
                menus: res.map((item) => {
                    item.loaded = false;
                    return item;
                }),
                hasData: res.length > 0
            }});

            this.setState({
                ...state
            });

            loading.success();
        });
    }

    public componentDidMount() {
        this.loadFirstLayerMenu();
    }

    /**
     * @callback
     * @desc 加载课程章节
     */
    public handleTreeNodeLoad = (treeNode: any): Promise<any> => {
        this.props.updateChapterMaterial({
            isLoading: 'true',
            updateTime: Date.now()
        });

        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                this.props.updateChapterMaterial({
                    isLoading: 'false',
                    updateTime: Date.now()
                });
                return;
            }

            const loading = messageFunc(); 

            const params: FormData = new FormData();
            const materialID: string = treeNode.props.dataRef.value;
            params.set('id', materialID);

            loadSectionList(params, treeNode, this.state.menus).then(({ menusState, showList }) => {
                menusState.length && this.setState({
                    menus: menusState.map((item: IMenuItem) => {
                        item.value === materialID && (item.loaded = true);
                        return item;
                    })
                });

                this.pushChapterMaterial(`${treeNode.props.dataRef.value}-0`, {
                    isLoading: 'false'
                }, menusState, loading.success);
                resolve();
            }, (reject: string) => {
                loading.warn(reject);

                this.props.updateChapterMaterial({
                    showList: [],
                    isLoading: 'false',
                    updateTime: Date.now()
                });

                resolve();
            });
        });
    }

    /** 
     * @func
     * @desc 查看点赞 收藏
     */
    public loadMaterialStatus = async (showList: ITeachChapterList[]) => {
        const params: IMaterialStatusRequest = {
            idList: showList.map((item: ITeachChapterList) => item.chapterId)
        };

        return await api.materialStatus(params).then((res: IMaterialStatusResponse) => {
            if (res.status === 200) {
                let { idList, idCollectionList } = res.data.result;
                idList = idList ? idList : [];
                idCollectionList = idCollectionList ? idCollectionList : [];
                return { idList, idCollectionList };
            }
        });
    }

    /** 
     * @callback
     * @desc 选择节点 
     */
    public selectNode = (selectedKeys: string[], e?: any) => {
        if (selectedKeys.length > 0) {
            this.pushChapterMaterial(selectedKeys[0], {}, this.state.menus, () => {}, e.node);
        }
    }

    /**
     * @func
     * @desc 推送相关的节点对应的章节材料
     * @param selectedKeys 该参数的结构为：materialId-章节的index-章节的id
     * @param otherParmas 
     */
    public pushChapterMaterial = async (selectedKeys: string, otherParmas: any = {}, stateMenus: IMenuItem[], func?: Function, treeNode?: any) => {
        this.props.updateChapterMaterial({
            isLoading: 'true',
            updateTime: Date.now()
        });

        const keysArr: string[] = selectedKeys.split('-');
        const materialID: string = keysArr[0];
        const sectionIndex: number = +keysArr[1];
        const course: IMenuItem = stateMenus.find((menu: IMenuItem) => menu.value === materialID)!;
        const courseChildren = course.children!;

        /** 展示列表 */
        let showList: ITeachChapterList[] = [];
        /** 面包屑 */
        let breadcrumb: string[] = [];

        /** 如果点击的是最外层 */
        if (keysArr[1] === matchOutermostLayerKey) {
            breadcrumb = [course.name];

            /** 判断该课程是否被加载过 */
            if (!course.loaded) {
                return this.handleTreeNodeLoad(treeNode);
            } else {
                /** 如果是已经被加载过了 */
                showList = courseChildren.reduce((cur: ITeachChapterList[], pre: IMenuItem) => {
                    const teachChapterList: ITeachChapterList[] = pre.teachChapterList!;
                    return cur.concat(teachChapterList);
                }, []);
            }
        } else {
            const section =  courseChildren[sectionIndex];
            breadcrumb = [course.name, section.name];
            showList= section.teachChapterList || [];
        }

        /** 查看点赞 收藏 */
        const { idList = [], idCollectionList = [] } = await this.loadMaterialStatus(showList);
        showList = showList.map((item: ITeachChapterList) => {
            const idListIndex = idList.findIndex((i: string) => i === item.chapterId);
            const collectionIndex = idCollectionList.findIndex((i: string) => i === item.chapterId);
            item.isCollect = collectionIndex > -1;
            item.isPraise = idListIndex > -1;
            return item;
        });

        func && func();

        this.props.updateChapterMaterial({
            breadcrumb,
            showList,
            ...otherParmas,
            isLoading: 'false',
            updateTime: Date.now()
        });
    }

    /** 
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = () => {
        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode icon={<SvgComponent className='svg-icon-chapter' type='icon-subway-chapter' />} title={child.name} key={child.key} isLeaf={child.isLeaf} dataRef={child}>
                    { (child.children!).length > 0 && buildTreeNode(child.children!) }
                </TreeNode>
            });
        };

        return <Tree 
                    showLine
                    loadData={this.handleTreeNodeLoad}
                    switcherIcon={<SvgComponent className='svg-icon-course' type='icon-subway'/>}
                    onSelect={this.selectNode}>
                    { buildTreeNode(this.state.menus) }
                </Tree>
    }

    public render() {
        const { isLoading, hasData } = this.state;

        return <div className='directory-box'>
                    <div className='directory-title'>
                        <SvgComponent className='book-svg' type='icon-book' />
                        <p>教材目录</p>
                    </div>
                    <div className='directory-menu-box'>
                        {
                            isLoading ? <>
                                <Skeleton active/>
                                <Skeleton active/>
                            </> : hasData ? this.buidlTree() : <>
                                <img className='no-data-img' alt='无数据' src={noDataImg} />
                                <p className='no-data-desc'>暂时没有教材目录</p>
                            </>
                        }
                    </div>
                </div>
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {
        updateChapterMaterial: bindActionCreators(updateChapterMaterial, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DirectoryContainer);
