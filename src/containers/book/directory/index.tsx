import * as React from 'react';
import { IDirectoryProps } from '../interface';
import { Tree, Skeleton } from 'antd';
import './index.scss';
// menu是本地写死的数据
import { IMenuItem } from './index.config';
import { SvgComponent } from 'components/icon/icon';
import { api } from 'common/api/index';
import noDataImg from 'assets/images/noData.png';
import { ITeachDirectoryMaterialList, ISection } from 'common/api/api-interface';
import { cloneDeep } from 'lodash';

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
     * @desc 加载最外层级目录菜单
     */
    public loadFirstLayerMenu = () => {
        this.setState({
            isLoading: true
        });

        api.loadTeachingMaterialDirectory().then((res: any) => {
            if (res.status === 200) {
                const { result } = res.data;
                const { teachMaterialList }: {teachMaterialList: ITeachDirectoryMaterialList[]} = result
                const menus: IMenuItem[] = teachMaterialList.map((item: ITeachDirectoryMaterialList) => {
                    return {
                        name: item.title,
                        key: String(item.id),
                        value: item.id,
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
     * @func
     * @desc 加载章节的目录
     */
    public loadSectionMenu = () => {

    }

    public componentDidMount() {
        this.loadFirstLayerMenu();
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

            const params = {
                /** 教材id */
                materialId: ''
            };
            
            api.loadSectionDirectory(params).then((res: any) => {
                if (res.status === 200) {
                    const { chapterResponseDtoList }: {chapterResponseDtoList: ISection[]} = res.data;
                    const { value } = treeNode.props.dataRef;
                    const menus: IMenuItem[] = chapterResponseDtoList.map((section: any, index: number) => {
                        const { section: item }: { section: ISection } = section;
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
                }
                resolve();
            });
        });
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
