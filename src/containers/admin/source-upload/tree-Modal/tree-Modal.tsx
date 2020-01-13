import * as React from 'react';
import { Modal, Tree, Skeleton } from 'antd';
import { IMenuItem } from 'containers/user/book/directory/index.config';
import { SvgComponent } from 'components/icon/icon';
import { loadMaterialMenu, loadSectionList, matchOutermostLayerKey } from 'common/service/tree-ajax';
import { ITeachChapterList } from 'common/api/api-interface';
import { messageFunc } from 'common/utils/function';
import { noData } from 'common/service/img-collection';
import './tree-Modal.scss';

export interface ITreeModalProps {
    handleClick: Function;
    [key: string]: any;
}

interface ICommon {
    [key: string]: any;
}

interface IState {
    menus: Array<IMenuItem>;
    isLoading: boolean;
    hasData: boolean;
    expandedKeys: string[];
    canExpandedKeys: boolean;
}

interface ITreeModalConfig extends ICommon {
    currentNode: any;
}

export interface treeModalResponse {
    materialName: string;
    materialId: string;
    chapterName: string;
    chapterId: string;
}

const { TreeNode } = Tree;

export class TreeModalContainer extends React.PureComponent<ITreeModalProps, IState> {
    public config:ITreeModalConfig;

    constructor(public props: ITreeModalProps) {
        super(props);

        this.state = {
            menus: [],
            isLoading: false,
            hasData: false,
            expandedKeys: [],
            canExpandedKeys: false
        };

        this.config = {
            currentNode: null
        };
    }

    public componentDidMount() {
        this.loadFirstLayerMenu();
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

    /**
     * @callback
     * @desc 加载课程章节
     */
    public handleTreeNodeLoad = (treeNode: any): Promise<any> => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
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
                loading.success();
                this.pushChapterMaterial(`${treeNode.props.dataRef.value}-${matchOutermostLayerKey}`, menusState);
                resolve();
            }, (reject: string) => {
                loading.warn(reject);
                resolve();
            });
        });
    }

    /** 
     * @callback
     * @desc 点击确认或者取消触发
     */
    public handleModalClick = (state: string) => {
        this.props.handleClick(this.config.currentNode);
    }

      /** 
     * @callback
     * @desc 选择节点 
     */
    public selectNode = (selectedKeys: string[], e?: any) => {
        if (selectedKeys.length > 0) {
            this.updateExpandedKeysState(e.node);
            this.pushChapterMaterial(selectedKeys[0], this.state.menus, e);

            // const { menus } = this.state;
            // const keysArr: string[] = selectedKeys[0].split('-');
            // const treeNode = e.node.props;
            // const materialId: string = keysArr[0];
            // const sectionIndex: number = +(keysArr[1]);
            // const course: IMenuItem = menus.find((menu: IMenuItem) => menu.value === materialId)!;
            // const courseChildren = course.children!;

            // if (course.children && sectionIndex >= 0) {
            //     const materialName = course.name;
            //     const chapterId = courseChildren[sectionIndex].value;
            //     const chapterName = treeNode.title;
            //     this.config.currentNode = {
            //         materialName,
            //         materialId,
            //         chapterName,
            //         chapterId
            //     };
            // }
        }
    }

    public pushChapterMaterial(selectedKeys: string, stateMenus: IMenuItem[], e?: any) {
        const keysArr: string[] = selectedKeys.split('-');
        const materialID: string = keysArr[0];
        const sectionIndex: number = +keysArr[1];
        const course: IMenuItem = stateMenus.find((menu: IMenuItem) => menu.value === materialID)!;
        const courseChildren = course.children!;

        /** 展示课程章节 */
        if (keysArr[1] === matchOutermostLayerKey) {
            /** 判断该课程是否被加载过 */
            if (!course.loaded) {
                return this.handleTreeNodeLoad(e.node);
            }
        } else {
            const materialName = course.name;
            const materialId: string = keysArr[0];
            const chapterId = courseChildren[sectionIndex].value;
            const treeNode = e.node.props;
            const chapterName = treeNode.title;
            this.config.currentNode = {
                materialName,
                materialId,
                chapterName,
                chapterId
            };
        }
    }

    /** 
     * @callback
     * @desc 处理节点展开事件
     */
    public handleTreeNodeExpand = (expandedKeys: string[], {expanded: bool, node}: any) => {
        this.updateExpandedKeysState(node, bool);
    }

    /** 
     * @func
     * @desc 更新expandedKeys状态
     */
    public updateExpandedKeysState = (node: any, bool: boolean = true) => {
        const { eventKey, children }: { eventKey: string, children: any[] } = node.props;

        if (eventKey.includes(matchOutermostLayerKey)) {
            const childrenKeys = (children || []).map((item: ITeachChapterList) => item.key);
            this.setState({
                expandedKeys: [eventKey].concat(childrenKeys),
                canExpandedKeys: bool
            }); 
        }
    }

    /** 
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = () => {
        const { expandedKeys, canExpandedKeys } = this.state;
        const otherTreeProps = {
            expandedKeys: [],
            ...canExpandedKeys && {
                expandedKeys
            }
        };

        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode icon={<SvgComponent className='svg-icon-chapter' type='icon-subway-chapter' />} title={child.name} key={child.key} isLeaf={child.isLeaf} dataRef={child}>
                    { (child.children!).length > 0 && buildTreeNode(child.children!) }
                </TreeNode>
            });
        };

        return <Tree
                    {...otherTreeProps} 
                    showLine
                    loadData={this.handleTreeNodeLoad}
                    onSelect={this.selectNode}
                    switcherIcon={<SvgComponent className='svg-icon-course' type='icon-subway'/>}
                    onExpand={this.handleTreeNodeExpand}>
                    { buildTreeNode(this.state.menus) }
                </Tree>
    }

    public render() {
        const { isLoading, hasData } = this.state;

        return <div>
                    <Modal 
                        title='课程章节选取' 
                        visible={true}
                        onOk={() => this.handleModalClick('ok')}
                        onCancel={() => this.handleModalClick('cancel')}
                        maskClosable={false}
                        okText='确认'
                        cancelText='取消'
                        className='admin-course-tree-modal'>
                            <div className='tree-menu'>
                                {
                                    isLoading ? <>
                                        <Skeleton active/>
                                        <Skeleton active/>
                                    </> : hasData ? this.buidlTree() : <>
                                        <img className='no-data-img' alt='无数据' src={noData} />
                                        <p className='no-data-desc'>暂时没有教材目录</p>
                                    </>
                                }
                            </div>
                    </Modal>
                </div>
    }
}
