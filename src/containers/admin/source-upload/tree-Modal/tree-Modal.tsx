import * as React from 'react';
import { Modal, Tree, Skeleton } from 'antd';
import { IMenuItem } from 'containers/book/directory/index.config';
import { SvgComponent } from 'components/icon/icon';
import { loadMaterialMenu, loadSectionList } from 'common/service/tree-ajax';
import { messageFunc } from 'common/utils/function';
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
            hasData: false
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
                menus: res,
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
            params.set('id', treeNode.props.dataRef.value);

            loadSectionList(params, treeNode, this.state.menus).then(({ menusState, showList }) => {
                menusState.length && this.setState({
                    menus: menusState
                });
                loading.success('加载完成');
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
        const { menus } = this.state;
        const keysArr: string[] = selectedKeys[0].split('-');
        const treeNode = e.node.props;
        const materialId: string = keysArr[0];
        const chapterIndex: number = +(keysArr[1]);
        const material = menus.find((menu: IMenuItem) => menu.value === materialId)!;

        if (material.children) {
            const materialName = material.name;
            const chapterId = (material.children!)[chapterIndex].value;
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
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = () => {
        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode icon={<SvgComponent className='svg-icon-chapter' type='icon-tree-node' />} title={child.name} key={child.key} isLeaf={child.isLeaf} dataRef={child}>
                    { (child.children!).length > 0 && buildTreeNode(child.children!) }
                </TreeNode>
            });
        };

        return <Tree 
                    showLine
                    loadData={this.handleTreeNodeLoad}
                    onSelect={this.selectNode}
                    switcherIcon={<SvgComponent className='svg-icon-course' type='icon-tree'/>}>
                    { buildTreeNode(this.state.menus) }
                </Tree>
    }

    public render() {
        const { isLoading } = this.state;

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
                                    </> : this.buidlTree()
                                }
                            </div>
                    </Modal>
                </div>
    }
}
