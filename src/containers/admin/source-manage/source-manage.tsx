import * as React from 'react';
import { columns, IConfig, ITableRecord, sourceFormat } from './source-manage.config';
import { cloneDeep } from 'lodash';
import { Table, Skeleton, Row, Col, Button, Icon, Divider, Popconfirm, message, Drawer, Breadcrumb } from 'antd';
import { SvgComponent } from 'components/icon/icon';
import { PageComponent, IPageComponnetProps, IPageInfo, defaultPageInfo } from 'components/pagination/index';
import ModifySourceContainer from './modify-source/modify-source';
import { CourseTreeContainer, ICourseTreeProps, courseTreeResponse } from 'components/course-tree/course-tree';
import { ITeachChapterList } from 'common/api/api-interface';
import { findTarget } from 'common/dictionary/index';
import './source-manage.scss';

interface ISourceManageContainerProps {
    [key: string]: any;
}

interface IState {
    totalDataSource: ITeachChapterList[];
    dataSource: ITeachChapterList[];
    hasData: boolean;
    pageInfo: IPageInfo;
    breadcrumb: string[];
    isLoading: boolean;
    showDrawer: boolean;
    currentEditSource: any;
    [key: string]: any;
}

// const { Search } = Input;

class SourceManageContainer extends React.PureComponent<ISourceManageContainerProps, IState> {
    public config: IConfig;
    public courseTreeRef: React.Ref<CourseTreeContainer>;
    
    constructor(public props: ISourceManageContainerProps) {
        super(props);

        this.state = {
            totalDataSource: [],
            dataSource: [],
            isLoading: false,
            hasData: false,
            showDrawer: false,
            breadcrumb: [],
            /** 分页 */
            pageInfo: {...defaultPageInfo},
            currentEditSource: {}
        };

        this.config = {
            columns: this.rebuildTableColumns(cloneDeep(columns)),
            sourceFormat
        };

        this.courseTreeRef = React.createRef();
    }

    public componentDidMount() {

    }

    /** 
     * @func
     * @desc 处理课程树
     */
    public handleCourseTreeClick = (response: courseTreeResponse) => {
        const { pageInfo } = this.state;
        const state: any = {
            ...response.showList && {
                totalDataSource: response.showList,
                dataSource: this.rebuildDataSource(response.showList.slice(0, pageInfo.pageSize)),
                hasData: response.showList.length > 0,
                pageInfo: { ...pageInfo, totalCount: response.showList.length }
            },
            ...response.breadcrumb && { breadcrumb: response.breadcrumb },
            ...response.isLoading && { isLoading: response.isLoading === 'true' ? true : false },
        };

        this.setState({
            ...state
        });
    }

    /** 
     * @func
     * @desc 改造dataSource数据
     */
    public rebuildDataSource = (dataSource: ITeachChapterList[]) => {
        const { sourceFormat } = this.config;

        return dataSource.map((item: ITeachChapterList) => {
            const target = findTarget(sourceFormat, String(item.fileFormat));
            item['typeName'] = target ? target.name : '';
            return item;
        });
    }

    /** 
     * @func
     * @desc 重新构建Table Column
     */
    public rebuildTableColumns = (columns: any[]): any[] => {
        const target = columns.find((item: any) => item.dataIndex === 'operation');

        if (target) {
            target.render = (text: string, record: any) => {
                return <span className='table-operation-box'>
                            <Popconfirm title='请确认删除。' onConfirm={() => this.deleteSource(record)} okText='确认' cancelText='取消'><Icon className='operation-box-icon' type='delete' />删除</Popconfirm>
                            <Divider type='vertical' />
                            <p onClick={() => this.editSource(record)}><Icon className='operation-box-icon' type='edit' />修改</p>
                        </span>;
            };
        }

        return columns;
    }

    /** 
     * @callback
     * @desc    删除资源
     */
    public deleteSource = (record: ITableRecord) => {
        message.success('删除成功');
    }

    /** 
     * @callback
     * @desc    编辑资源
     */
    public editSource = (record: ITableRecord) => {
        this.setState({
            showDrawer: true,
            currentEditSource: record
        });
    }

    /** 
     * @callback
     * @desc   添加资源 
     */
    public addSource = () => {
        const { history } = this.props;
        const url: string = '/admin/system/upload';
        history.push(url);
    }

    /** 
     * @callback
     * @desc 处理搜索
     */
    public handleInputSearch = (e: any) => {
    }

    /** 
     * @callback
     * @desc 重新刷新数据
     */
    public refreshDataSource = () => {
        (this.courseTreeRef! as any).current!.loadFirstLayerMenu();
        this.setState({
            dataSource: [],
            hasData: false,
            breadcrumb: []
        });
    }

    /** 
     * @func
     * @desc 分页发生变化
     */
    public pageChange = (page: number, pageSize?: number) => {
        const { totalDataSource } = this.state;
        this.setState({
            dataSource: this.rebuildDataSource(totalDataSource.slice((page - 1)*pageSize!, page*pageSize!)),
            pageInfo: {
                ...this.state.pageInfo,
                currentPage: page,
                ...pageSize && {
                    pageSize
                }
            }
        });
    }

    /** 
     * @func
     * @desc drawer开关
     */
    public toggleDrawer = (bol: boolean) => {
        this.setState({
            showDrawer: bol
        });
    }

    /** 
     * @func
     * @desc 编辑组件的回调函数
     */
    public modifySourceCallBack = ({type}: {type: string}) => {
        this.toggleDrawer(false)
        // type === 'saveComplete' && this.loadSourceData();
    }

    public render() {
        const { hasData, dataSource, isLoading, pageInfo, showDrawer, breadcrumb, currentEditSource } = this.state;
        const pageComponentProps: IPageComponnetProps = {
            ...pageInfo,
            pageChange: this.pageChange
        };
        const modifySourceProps: any = {
            callBack: this.modifySourceCallBack,
            source: currentEditSource,
            updateTime: Date.now()
        };
        const courseTreeProps: ICourseTreeProps = {
            handleClick: this.handleCourseTreeClick
        };

        return (
            <div className='source-manage-container animateCss'>
                <div className='operation-box'>
                    <Row>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Button type='primary' className='btn-addCourse' onClick={this.addSource}><SvgComponent className='add-course-svg' type='icon-add-directory' />添加资源</Button>
                            <Button type='primary' className='btn-refresh' onClick={this.refreshDataSource}><Icon type="reload" />刷新</Button>
                        </Col>
                    </Row>
                </div>
                <div className='table-box'>
                    <div className='table-tree'>
                        <CourseTreeContainer {...courseTreeProps} ref={this.courseTreeRef}/>
                    </div>
                    <div className='table-tree-content'>
                        {
                            isLoading ? <>
                                <Skeleton />
                                <Skeleton />
                            </> : <>
                                <div>
                                    {
                                        breadcrumb.length > 0 && <div className='breadcrumb-box'>
                                            <SvgComponent className='svg-breadcrumb' type='icon-breadcrumb'/>
                                            <Breadcrumb>
                                                {
                                                    breadcrumb.map((item: string, index: number) => {
                                                        return <Breadcrumb.Item key={`breadcrumb-${index}`}>{item}</Breadcrumb.Item>
                                                    })
                                                }
                                            </Breadcrumb>
                                        </div>
                                    }
                                    <div className='inner-table-box'>
                                        <Table
                                            columns={this.config.columns}
                                            dataSource={hasData ? dataSource : undefined }
                                            pagination={false}
                                            scroll={{ x: 1950 }} 
                                        />
                                    </div>
                                    {
                                        dataSource.length > 0 && <div className='source-result-pagination'>
                                            <PageComponent {...pageComponentProps}/>
                                        </div>
                                    }
                                </div>
                                <Drawer 
                                    title='编辑资源'
                                    width={520}
                                    onClose={() => this.toggleDrawer(false)}
                                    visible={showDrawer}
                                    maskClosable={false}>
                                    { showDrawer && <ModifySourceContainer {...modifySourceProps}/> }
                                </Drawer>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SourceManageContainer;
