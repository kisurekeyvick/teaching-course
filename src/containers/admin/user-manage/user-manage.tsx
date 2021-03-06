import * as React from 'react';
import { api } from 'common/api/index';
import { messageFunc } from 'common/utils/function';
import { IQueryPersonListResponseResult, IQueryPersonListRequestParams, IQueryPersonDataResult, 
    IAccountInfo, IDeleteUserResponseResult } from 'common/api/api-interface';
import { PageComponent, IPageComponnetProps, IPageInfo, defaultPageInfo } from 'components/pagination/index';
import { Table, Row, Col, Button, Icon, Skeleton, Popconfirm, Divider, Drawer } from 'antd';
import { IConfig, columns } from './user-manage.config';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { defaultUserPic } from 'common/service/img-collection';
import { UserFormModifyContainer, IUserFormModifyProps } from './user-form/index';
import './user-manage.scss';

interface IUserManageContainerProps {
    [key: string]: any;
}

interface IState {
    dataSource: IQueryPersonDataResult[];
    hasData: boolean;
    pageInfo: IPageInfo;
    isLoading: boolean;
    selectedRowKeys: string[] | number[];
    selectedRows: IQueryPersonDataResult[];
    showDrawer: boolean;
    currentEditSource: any;
    operation: 'add' | 'edit' | null; 
    [key: string]: any;
}

class UserManageContainer extends React.PureComponent<IUserManageContainerProps, IState> {
    public config: IConfig;

    constructor(public props: IUserManageContainerProps) {
        super(props);

        this.state = {
            dataSource: [],
            hasData: false,
            isLoading: false,
            showDrawer: false,
            selectedRowKeys: [],
            selectedRows: [],
            currentEditSource: null,
            operation: null,
            /** 分页 */
            pageInfo: {...defaultPageInfo},
        };

        this.config = {
            columns: this.rebuildTableColumns(cloneDeep(columns))
        };
    }

    componentDidMount() {
        this.loadPersonList();
    }

    public rebuildTableColumns = (columns: any[]): any[] => {
        const operation = columns.find((item: any) => item.dataIndex === 'operation');
        const userName = columns.find((item: any) => item.dataIndex === 'userName');

        if (operation) {
            operation.render = (text: string, record: IAccountInfo) => {
                return <span className='table-operation-box'>
                            <Popconfirm title='确认删除?' onConfirm={() => this.deleteSource(record)} okText='确认' cancelText='取消'><Icon className='operation-box-icon' type='delete' />删除</Popconfirm>
                            <Divider type='vertical' />
                            <p onClick={() => this.editSource(record)}><Icon className='operation-box-icon' type='edit' />修改</p>
                        </span>;
            };
        }

        if (userName) {
            userName.render = (text: string, record: IAccountInfo) => {
                return <span>
                    <img className='user-img' alt='user-img' src={record.link || defaultUserPic}/>
                    <span>{text}</span>
                </span>
            }
        }

        return columns;
    }

    /** 
     * @func
     * @desc 加载用户列表
     */
    public loadPersonList = (params: IQueryPersonListRequestParams = {}) => {
        const loading = messageFunc();
        const { pageInfo } = this.state;

        this.setState({
            isLoading: true
        });

        api.queryPersonList(params).then((res: IQueryPersonListResponseResult) => {
            if (res.status === 200 && res.data.success) {
                const { total, pageNum, list = [], pageSize } = res.data.result.teachChapterList;
                
                const dataSource = list.map((item: IQueryPersonDataResult, index: number) => {
                    item.key = `${item.id}-${index}`;
                    item.updateTime = item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '';
                    return item;
                });
                
                this.setState({
                    dataSource,
                    isLoading: false,
                    hasData: dataSource.length > 0,
                    pageInfo: {
                        ...pageInfo, ...{
                            pageSize,
                            currentPage: pageNum,
                            totalCount: total
                        }
                    },
                });

                loading.success(res.data.desc);
            } else {
                this.setState({
                    isLoading: false,
                    dataSource: [],
                    hasData: false,
                    pageInfo: {
                        ...pageInfo,
                        ...{
                            totalCount: 0,
                            pageNum: 1
                        }
                    }
                });

                loading.error(res.data.desc);
            }
        });
    }

    /** 
     * @callback
     * @desc 刷新
     */
    public refreshDataSource = () => {
        this.loadPersonList();
    }

     /** 
     * @func
     * @desc 分页发生变化
     */
    public pageChange = (page: number, pageSize?: number) => {
        const params: IQueryPersonListRequestParams= {
            pageInfo:{
                pageNum: page,
                pageSize: pageSize || 10
            }
        };

        this.loadPersonList(params);
    }

    /** 
     * @func
     * @desc 新增用户
     */
    public addUser = () => {
        this.setState({
            operation: 'add',
            showDrawer: true,
            currentEditSource: null
        });
    }

    /** 
     * @callback
     * @desc 批量删除用户
     */
    public batchDeleteUser = () => {
        const { selectedRows } = this.state;
        const requestArr:Array<Promise<any>> = selectedRows.map((item: IQueryPersonDataResult) => {
            const params: FormData = new FormData();
            params.set('teacherId', item.teacherId);
            return api.deleteUser(params);
        });

        const loading = messageFunc('正在删除中...');
        Promise.all(requestArr).then((res: IDeleteUserResponseResult[]) => {
            if (res.every((resItem: IDeleteUserResponseResult) => resItem.status === 200 && resItem.data.success)) {
                loading.success(res[0].data.desc);
                this.loadPersonList();
            } else {
                loading.error('删除失败');
            }
        });
    }

    /** 
     * @func
     * @desc 删除用户
     */
    public deleteSource = (record: IAccountInfo) => {
        const loading = messageFunc('正在删除中...');

        const params: FormData = new FormData();
        params.set('teacherId', record.teacherId);

        api.deleteUser(params).then((res: IDeleteUserResponseResult) => {
            if (res.status === 200 && res.data.success) {
                loading.success(res.data.desc);
                this.loadPersonList();
            } else {
                loading.error(res.data.desc);
            }
        });
    }

    /** 
     * @func
     * @desc 编辑用户
     */
    public editSource = (record: IAccountInfo) => {
        this.setState({
            operation: 'edit',
            showDrawer: true,
            currentEditSource: record
        });
    }

    /** 
     * @callback
     * @desc 选中改变
     */
    public onSelectChange = (keys: string[] | number[], selectedRows: IQueryPersonDataResult[]) => {
        this.setState({ selectedRowKeys: keys, selectedRows });
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
     * @desc 处理Drawer发出的事件
     */
    public handleUserFormModifyEvent = ({ hideDrawer }: {hideDrawer: boolean}) => {
        if (hideDrawer) {
            this.setState({
                showDrawer: false
            });
    
            this.loadPersonList();
        }
    }

    public render() {
        const { isLoading, hasData, dataSource, pageInfo, selectedRowKeys, showDrawer, operation, currentEditSource } = this.state;
        
        const pageComponentProps: IPageComponnetProps = {
            ...pageInfo,
            pageChange: this.pageChange
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const drawerTitle: string = operation === 'edit' ? '编辑用户' : '新增用户';

        const userFormModifyProps: IUserFormModifyProps = {
            userInfo: currentEditSource,
            updateTime: Date.now(),
            operation,
            eventEmitterFunc: this.handleUserFormModifyEvent
        };

        return (
            <div className='user-manage-container animateCss'>
                <div className='operation-box'>
                    <Row>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Button type='primary' className='btn-refresh' onClick={this.addUser}><Icon type="plus" />新增用户</Button>
                            <Button type='primary' disabled={selectedRowKeys.length === 0} className='btn-refresh' onClick={this.batchDeleteUser}><Icon type="delete" />批量删除</Button>
                            <Button type='primary' className='btn-refresh' onClick={this.refreshDataSource}><Icon type="reload" />刷新</Button>
                        </Col>
                    </Row>
                </div>
                <div className='table-box'>
                    {
                        isLoading ? <>
                            <Skeleton />
                            <Skeleton />
                        </> : <>
                            <div className='inner-table-box'>
                                <Table
                                    rowSelection={rowSelection}
                                    columns={this.config.columns}
                                    dataSource={hasData ? dataSource : undefined }
                                    pagination={false}
                                    scroll={{ x: 900 }} 
                                />
                            </div>
                            {
                                dataSource.length > 0 && <div className='source-result-pagination'>
                                    <PageComponent {...pageComponentProps}/>
                                </div>
                            }
                        </>
                    }
                </div>
                <Drawer
                    title= {drawerTitle}
                    width={520}
                    onClose={() => this.toggleDrawer(false)}
                    visible={showDrawer}
                    maskClosable={false}>
                    { showDrawer && <UserFormModifyContainer {...userFormModifyProps}/> }
                </Drawer>
            </div>
        )
    }
}

export default UserManageContainer;
