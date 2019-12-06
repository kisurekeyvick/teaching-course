import * as React from 'react';
import { cloneDeep } from 'lodash';
import { api } from 'common/api/index';
import { ICommon, ITreeNodeDrag } from '../interface';
import { Tree, Input, Skeleton, Button } from 'antd';
import './directory-manage.scss';
import { IMenuItem } from 'containers/book/directory/index.config';

interface IDirectoryManageProps {
    [key: string]: any;
}

interface IState {
    menuList: IMenuItem[];
    [key: string]: any;
}

const { TreeNode } = Tree;
const { Search } = Input;

export default class DirectoryManageContainer extends React.Component<IDirectoryManageProps, IState> {
    constructor(public props: IDirectoryManageProps) {
        super(props);

        this.state = {
            menuList: []
        };
    }

    public componentDidMount() {
        this.loadTeachingMenu();
    }

    /**
     * @func
     * @desc 加载教学目录数据
     */
    public loadTeachingMenu() {
        api.loadTeachingMenu().then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    menuList: res.data
                });
            }
        })
    }

    /** 
     * @callback
     * @desc 点击树节点
     */
    public handleTreeNodalSelect = (selectedKeys: string[], info: ICommon) => {
    }

    /** 
     * @callback
     * @desc 节点dragenter 触发时调用
     */
    public handleTreeNodeDragEnter = () => {

    }

    /** 
     * @callback
     * @desc 节点drop 触发时调用
     */
    public handleTreeNodeDrop = (info: ITreeNodeDrag) => {
        const dropKey: string = info.node.props.eventKey;
        const dragKey: string = info.dragNode.props.eventKey;
        const dropPos: Array<string> = info.node.props.pos.split('-');
        const dropPosition = (info.dropPosition!) - Number(dropPos[dropPos.length - 1]);

        const loop = (data: Array<IMenuItem>, key: string, callback: Function) => {
            data.forEach((item, index: number, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }

                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };

        const data: IMenuItem[] = [...this.state.menuList];

        // 拖拽目标
        let dragObj: IMenuItem;
        loop(data, dragKey, (item: IMenuItem, index: number, arr: IMenuItem[]) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item: IMenuItem) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            })
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item: IMenuItem) => {
                item.children = item.children || [];
                item.children.unshift(dragObj);
            });
        } else {
            let _arr: any[] = [];
            let _index: number = 0;
            loop(data, dropKey, (item: IMenuItem, index: number, arr: IMenuItem[]) => {
                _arr = arr;
                _index = index;
            });

            if (dropPosition === -1) {
                _arr.splice(_index, 0, dragObj!);
            } else {
                _arr.splice(_index + 1, 0, dragObj!);
            }
        }

        this.setState({
            menuList: data
        });
    }

    /** 
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = (): React.ReactNode => {
        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode title={child.name} key={child.key} nodeInfo={child}>
                    { child.children.length > 0 && buildTreeNode(child.children) }
                </TreeNode>
            });
        };

        return <Tree draggable blockNode 
                    onSelect={this.handleTreeNodalSelect}
                    onDragEnter={this.handleTreeNodeDragEnter}
                    onDrop={this.handleTreeNodeDrop}>
                { buildTreeNode(this.state.menuList) }
            </Tree>
    }

    /** 
     * @callback
     * @desc 搜索目录节点
     */
    public handleSearchTreeNodeChange = (e: any) => {
        const { value } = e.targe;
    }

    /** 
     * @callback
     * @desc 保存
     */
    public save = () => {

    }

    public render() {
        const treeNode: React.ReactNode = this.buidlTree();

        return (
            <div className='directory-manage-container animateCss'>
                <div className='search-box'>
                    <Search style={{ marginBottom: 8 }} placeholder='输入内容快速定位教材目录节点' onChange={this.handleSearchTreeNodeChange} />
                </div>
                <div className='tree-box'>
                    {
                        this.state.menuList.length > 0 ?
                        treeNode :
                        <>
                            <Skeleton active />
                            <Skeleton active />
                        </>
                    }
                </div>
                <div className='operation-group'>
                    <Button type='primary' onClick={this.save}>保存</Button>
                </div>
            </div>
        )
    }
}
