import * as React from 'react';
import { IDirectoryProps } from '../interface';
import { Tree, Skeleton } from 'antd';
import { cloneDeep } from 'lodash';
import './index.scss';
// menu是本地写死的数据
import { IMenuItem } from './index.config';
import { SvgComponent } from 'components/icon/icon';
import { api } from 'common/api/index';
import noDataImg from 'assets/images/noData.png';

const { TreeNode } = Tree;

interface IState {
    menus: IMenuItem[];
    hasData: boolean;
    isLoading: boolean;
}

export default class DirectoryContainer extends React.PureComponent<IDirectoryProps, IState> {
    constructor(public props: IDirectoryProps) {
        super(props);
    
        this.state = {
            menus: [],
            hasData: false,
            isLoading: false
        };
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