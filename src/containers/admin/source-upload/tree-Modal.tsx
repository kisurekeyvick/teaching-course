import * as React from 'react';
import { Modal, Tree, Skeleton, message } from 'antd';
import { IMenuItem } from 'containers/book/directory/index.config';
import { api } from 'common/api/index';
import { ITeachDirectoryMaterialList, IMaterialSectionResponseResult, IChapterResponseDtoListItem,
    ISectionItem, IMaterialListResponseResult } from 'common/api/api-interface';
import { cloneDeep } from 'lodash';
import { SvgComponent } from 'components/icon/icon';

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
        this.setState({
            isLoading: true
        });

        api.materialList().then((res: IMaterialListResponseResult) => {
            if (res.status === 200) {
                const { result } = res.data;
                const { teachMaterialList }: {teachMaterialList: ITeachDirectoryMaterialList[]} = result
                const menus: IMenuItem[] = teachMaterialList.map((item: ITeachDirectoryMaterialList) => {
                    return {
                        name: item.title,
                        key: String(item.id),
                        value: item.materlId,
                        children: [],
                        id: item.id,
                        isLeaf: false,
                        weight: item.weight
                    };
                }).sort((x: IMenuItem, y: IMenuItem) => {
                    return y.weight - x.weight;
                });

                this.setState({
                    menus,
                    hasData: menus.length > 0,
                    isLoading: false
                });
            }
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

            const params: FormData = new FormData();
            params.set('id', treeNode.props.dataRef.value);

            api.sectionList(params).then((res: IMaterialSectionResponseResult) => {
                if (res.status === 200 && res.data.result) {
                    const { chapterResponseDtoList }: { chapterResponseDtoList: IChapterResponseDtoListItem[] } = res.data.result;
                    const { value } = treeNode.props.dataRef;
                    const menus: IMenuItem[] = chapterResponseDtoList.map((chapter: IChapterResponseDtoListItem, index: number) => {
                        const item: ISectionItem = chapter.section;
                        return {
                            name: item.name,
                            key: `${value}-${index}-${item.id}`,
                            value: item.id,
                            id: item.id,
                            isLeaf: true,
                            weight: item.weight,
                            children: []
                        };
                    }).sort((x: IMenuItem, y: IMenuItem) => {
                        return y.weight - x.weight;
                    });

                    menus.forEach((menu: IMenuItem) => {
                        treeNode.props.dataRef.children.push({
                            title: menu.name,
                            key: menu.key
                        });
                    });

                    const menusState: IMenuItem[] = cloneDeep(this.state.menus);
                    const target: IMenuItem = menusState.find((item: IMenuItem) => item.value === value)!;
                    target.children! = menus;

                    this.setState({
                        menus: menusState
                    });
                } else {
                    res.data && message.warn(res.data.desc);
                }

                resolve();
            });
        });
    }

    /** 
     * @func
     * @desc 加载目录菜单
     */
    public loadMenu = () => {
        this.setState({
            isLoading: true
        });

        api.loadTeachingMaterialDirectory().then((res: any) => {
            if (res.status === 200) {
                const menus = res.data;

                this.setState({
                    menus,
                    hasData: menus.length > 0,
                    isLoading: false
                });
            }
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
     * @desc 点击树节点
     */
    public handleTreeNodalSelect = (selectedKeys: string[], info: ICommon) => {
        this.config.currentNode = info.selectedNodes.map((i: ICommon) => i.props.nodeInfo);
    }

    /** 
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = () => {
        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode icon={<SvgComponent className='svg-icon-chapter' type='icon-chapter' />} title={child.name} key={child.key} isLeaf={child.isLeaf} dataRef={child}>
                    { (child.children!).length > 0 && buildTreeNode(child.children!) }
                </TreeNode>
            });
        };

        return <Tree 
                    showLine
                    loadData={this.handleTreeNodeLoad}
                    switcherIcon={<SvgComponent className='svg-icon-course' type='icon-course'/>}>
                    { buildTreeNode(this.state.menus) }
                </Tree>
    }

    public render() {
        const { isLoading } = this.state;

        return <div>
                    <Modal 
                        title='课程节点选取' 
                        visible={true}
                        onOk={() => this.handleModalClick('ok')}
                        onCancel={() => this.handleModalClick('cancel')}
                        okText='确认'
                        cancelText='取消'>
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
