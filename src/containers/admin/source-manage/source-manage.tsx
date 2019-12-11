import * as React from 'react';
import { api } from 'common/api/index';
import { columns, IConfig, ITableRecord } from './source-manage.config';
import { cloneDeep } from 'lodash';
import { Table, Skeleton, Row, Col, Button, Input, Icon, Divider, Popconfirm, message, Drawer } from 'antd';
import { SvgComponent } from 'components/icon/icon';
import { PageComponent, IPageComponnetProps, IPageInfo } from 'components/pagination/index';
import { dictionary, IDictionaryItem, findTarget } from 'common/dictionary/index';
import ModifySourceContainer from './modify-source/modify-source';
import './source-manage.scss';

interface ISourceManageContainerProps {
    [key: string]: any;
}

interface IState {
    dataSource: ITableRecord[];
    hasData: boolean;
    pageInfo: IPageInfo;
    isLoading: boolean;
    showDrawer: boolean;
    [key: string]: any;
}

const { Search } = Input;

class SourceManageContainer extends React.PureComponent<ISourceManageContainerProps, IState> {
    public config: IConfig;
    
    constructor(public props: ISourceManageContainerProps) {
        super(props);

        this.state = {
            dataSource: [],
            isLoading: false,
            hasData: false,
            showDrawer: false,
            /** 分页 */
            pageInfo: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                rowCount: 0,
                totalCount: 0,
                pageSizeOptions:['10', '20', '30', '40', '50']
            },
        };

        this.config = {
            columns: this.rebuildTableColumns(cloneDeep(columns))
        };
    }

    public componentDidMount() {
        this.loadSourceData();
    }

    /** 
     * @func
     * @desc 加载资源
     */
    public loadSourceData = (params = {}) => {
        message.loading('加载数据中', 2);

        this.setState({
            isLoading: true
        });

        api.loadSourceManageResult(params).then((res: any) => {
            if (res.status === 200) {
                const sourceTypeList: IDictionaryItem[] = dictionary.get('source-type') || [];

                const dataSource = (res.data || []).map((item: any) => {
                    const target = findTarget(sourceTypeList, item.type);
                    item['typeName'] = target ? target.name : item.type;
                    item['key'] = item.id;
                    return item;
                });

                this.setState({
                    dataSource,
                    hasData: dataSource.length > 0,
                    isLoading: false
                });

                message.info('加载完成');
            }
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
        this.loadSourceData();
    }

    /** 
     * @callback
     * @desc    编辑资源
     */
    public editSource = (record: ITableRecord) => {
        this.toggleDrawer(true);
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
        this.loadSourceData();
    }

    /** 
     * @callback
     * @desc 重新刷新数据
     */
    public refreshDataSource = () => {
        this.loadSourceData();
    }

    /** 
     * @func
     * @desc 分页发生变化
     */
    public pageChange = (page: number, pageSize?: number) => {
        this.setState({
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
        type === 'saveComplete' && this.loadSourceData();
    }

    public render() {
        const { hasData, dataSource, isLoading, pageInfo, showDrawer } = this.state;
        const pageComponentProps: IPageComponnetProps = {
            ...pageInfo,
            pageChange: this.pageChange
        };
        const modifySourceProps: any = {
            callBack: this.modifySourceCallBack
        };

        return (
            <div className='source-manage-container animateCss'>
                <div className='operation-box'>
                    <Row>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Button type='primary' className='btn-addCourse' onClick={this.addSource}><SvgComponent className='add-course-svg' type='icon-add-directory' />添加资源</Button>
                            <Button type='primary' className='btn-refresh' onClick={this.refreshDataSource}><Icon type="reload" />刷新</Button>
                        </Col>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Search style={{ marginBottom: 8 }} placeholder='搜索资源' onChange={this.handleInputSearch} />
                        </Col>
                    </Row>
                </div>
                <div className='table-box'>
                    {
                        isLoading ? <>
                            <Skeleton />
                            <Skeleton />
                        </> : <>
                            <Table
                                columns={this.config.columns}
                                dataSource={hasData ? dataSource : undefined }
                                pagination={false}
                            />
                            {
                                dataSource.length > 0 && <div className='source-result-pagination'>
                                    <PageComponent {...pageComponentProps}/>
                                </div>
                            }
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
        )
    }
}

export default SourceManageContainer;
