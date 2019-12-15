import * as React from 'react';
import { IDirectoryProps } from '../interface';
import { Tree, Skeleton, message } from 'antd';
import './index.scss';
// menu是本地写死的数据
import { IMenuItem } from './index.config';
import { SvgComponent } from 'components/icon/icon';
// import { api } from 'common/api/index';
import noDataImg from 'assets/images/noData.png';
// import { ITeachDirectoryMaterialList, IMaterialSectionResponseResult, IChapterResponseDtoListItem,
//     ISectionItem, IMaterialListResponseResult } from 'common/api/api-interface';
// import { cloneDeep } from 'lodash';
import { loadMaterialMenu, loadSectionList } from 'common/service/tree-ajax';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateChapterMaterial } from 'store/material-chapter/action';

const { TreeNode } = Tree;

interface IState {
    menus: IMenuItem[];
    hasData: boolean;
    isLoading: boolean;
}

class DirectoryContainer extends React.PureComponent<IDirectoryProps, IState> {
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

        loadMaterialMenu().then((res: IMenuItem[]) => {
            const state = {
                isLoading: false
            };
            
            if (res.length) {
                Object.assign(state, {
                    menus: res,
                    hasData: res.length > 0
                });
            }

            this.setState({
                ...state
            });
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

            const params: FormData = new FormData();
            params.set('id', treeNode.props.dataRef.value);

            loadSectionList(params, treeNode, this.state.menus).then(({ menusState, showList }) => {
                menusState.length && this.setState({
                    menus: menusState
                });

                this.props.updateChapterMaterial({
                    materialSource: menusState,
                    showList,
                    isLoading: 'false'
                });
                resolve();
            }, (reject: string) => {
                message.warn(reject);
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
