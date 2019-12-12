import * as React from 'react';
import { Modal, Tree, Skeleton } from 'antd';
import { IMenuItem } from 'containers/book/directory/index.config';
import { api } from 'common/api/index';

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
        this.loadMenu();
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
                return <TreeNode title={child.name} key={child.key} nodeInfo={child}>
                    { child.children.length > 0 && buildTreeNode(child.children) }
                </TreeNode>
            });
        };

        return <Tree onSelect={this.handleTreeNodalSelect}>
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
