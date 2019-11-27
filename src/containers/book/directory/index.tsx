import * as React from 'react';
import { IDirectoryProps } from '../interface';
import { Tree } from 'antd';
import * as _ from 'lodash';
import './index.scss';
// menu是本地写死的数据
import { menu, IMenuItem } from './index.config';
import { SvgComponent } from 'components/icon/icon';

const { TreeNode } = Tree;

export default class DirectoryContainer extends React.PureComponent<IDirectoryProps, any> {
    constructor(public props: IDirectoryProps) {
        super(props);
    
        this.state = {
            menus: _.cloneDeep(menu)
        };
    }

    /** 
     * @func
     * @desc 加载目录菜单
     */
    public loadMenu = () => {

    }

    public componentDidMount() {
        this.loadMenu();
    }

    /** 
     * @func
     * @desc 构建教材目录
     */
    public buidlTree = () => {
        const buildTreeNode = (children: IMenuItem[]) => {
            return children.map((child: IMenuItem) => {
                return <TreeNode title={child.name} key={child.key}>
                    { child.children.length > 0 && buildTreeNode(child.children) }
                </TreeNode>
            });
        };

        return <Tree>
                { buildTreeNode(this.state.menus) }
            </Tree>
    }

    public render() {
        return <div className='directory-box'>
                    <div className='directory-title'>
                        <SvgComponent className='book-svg' type='icon-book' />
                        <p>教材目录</p>
                    </div>
                    <div className='directory-menu-box'>
                        { this.buidlTree() }
                    </div>
                </div>
    }
}