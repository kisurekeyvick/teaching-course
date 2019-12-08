import * as React from 'react';
import { Modal, Tree } from 'antd';
import { menu, IMenuItem } from 'containers/book/directory/index.config';
import { cloneDeep } from 'lodash';

export interface ITreeModalProps {
    handleClick: Function;
    [key: string]: any;
}

interface ICommon {
    [key: string]: any;
}

interface IState {
    menus: Array<IMenuItem>
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
            menus: cloneDeep(menu)
        };

        this.config = {
            currentNode: null
        };
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
        return <div>
                    <Modal 
                        title='课程节点选取' 
                        visible={true}
                        onOk={() => this.handleModalClick('ok')}
                        onCancel={() => this.handleModalClick('cancel')}
                        okText='确认'
                        cancelText='取消'>
                            <div className='tree-menu'>
                                { this.buidlTree() }
                            </div>
                    </Modal>
                </div>
    }
}
