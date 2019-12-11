import * as React from 'react';
import { api } from 'common/api/index';
import { cloneDeep } from 'lodash';
import { Table, Input, Divider, Icon, Row, Col, Popconfirm, BackTop, Skeleton, Form, notification, Button, message } from 'antd';
import { columns, IConfig, ITableRecord, addCourseFieldTemplate } from './directory-manage-config';
import { SvgComponent } from 'components/icon/icon';
import './directory-manage-table.scss';
import { EditableContext, EditableCell } from './editableCell';

interface IDirectoryManageProps {
    [key: string]: any;
}

interface IDataSource {
    name: string;
    key: string;
    children?: IDataSource[]
}

interface IState {
    dataSource: IDataSource[];
    hasData: boolean;
    isLoading: boolean;
    editingKey: string;
}

const { Search } = Input;

class DirectoryManageContainer extends React.PureComponent<IDirectoryManageProps, IState> {
    public config: IConfig;

    constructor(public props: IDirectoryManageProps) {
        super(props);

        this.config = {
            columns: this.rebuildTableColumns(cloneDeep(columns)),
            operationHistory: {
                type: '',
                detail: {}
            }
        };

        this.state = {
            dataSource: [],
            hasData: false,
            isLoading: true,
            editingKey: ''
        };
    }

    public componentDidMount() {
        this.loadTeachingMenu();
    }

    public globalNotify = () => {
        const key: string = `open${Date.now()}`;
        const btn: React.ReactNode = (
            <Button type="primary" size="small" onClick={() => this.saveAllCourse(key)}>
                确认
            </Button>
        );
        notification.open({
            message: `课程修改保存`,
            description: '保存以后，数据将存储到数据库中，请确认自己的修改无误',
            key,
            btn,
            duration: null
        });
    }

    /**
     * @callback
     * @desc 保存所有修改的课程数据
     */
    public saveAllCourse = (key: string) => {
        notification.close(key);

        this.loadTeachingMenu();
    }

    /** 
     * @func
     * @desc 重新构建Table Column
     */
    public rebuildTableColumns = (columns: any[]): any[] => {
        const target = columns.find((item: any) => item.dataIndex === 'operation');

        if (target) {
            target.render = (text: string, record: any) => {
                const editable = this.isEditing(record);

                return <span className='table-operation-box'>
                            <Popconfirm title='请确认删除。' onConfirm={() => this.deleteCourse(record)} okText='确认' cancelText='取消'><Icon className='operation-box-icon' type='delete' />删除</Popconfirm>
                            <Divider type='vertical' />
                            <p><Icon className='operation-box-icon' type='eye' />查看资源</p>
                            <Divider type='vertical' />
                            {
                                record.children && <>
                                    <p onClick={() => this.addCourseSecondaryDirectory(record)}><Icon className='operation-box-icon' type='plus' />新增二级目录页</p>
                                    <Divider type='vertical' />
                                </>
                            }
                            {
                                editable ? <>
                                    <EditableContext.Consumer>
                                        {
                                            form => (
                                                <p onClick={() => this.modifyCourseComplete(form, record)}><Icon className='operation-box-icon' type='save' />修改完成</p>
                                            )
                                        }
                                    </EditableContext.Consumer>
                                    <Divider type='vertical' />
                                    <p onClick={() => this.cancelModifyCourse(record)}><SvgComponent className='cancel-svg operation-box-icon' type='icon-undo'/>撤销</p>
                                    <Divider type='vertical' />
                                </> : 
                                <>
                                    <p onClick={() => this.editCourse(record)}><Icon className='operation-box-icon' type='edit' />修改</p>
                                    <Divider type='vertical' />
                                </>
                            }
                            <p onClick={() => this.moveCourse(record, 'up')}><Icon className='operation-box-icon' type='arrow-up' />上移</p>
                            <Divider type='vertical' />
                            <p onClick={() => this.moveCourse(record, 'down')}><Icon className='operation-box-icon' type='arrow-down' />下移</p>
                        </span>
            };
        }

        return columns;
    }

    /** 
     * @callback
     * @desc 是否处于编辑状态
     */
    public isEditing = (record: ITableRecord) => record.key === this.state.editingKey;

    /** 
     * @callback
     * @desc 教材目录移动
     * @param type  up代表上移,down代表下移
     */
    public moveCourse = (record: ITableRecord, type: string) => {
        const indexArr: number[] = this.getCurrentItemIndex(record);
        const addIndex = type === 'up' ? -1 : 1;
        const dataSource = cloneDeep(this.state.dataSource);

        /** 最高级的目录移动 */
        if (indexArr.length === 1) {    
            let targetLocationIndex: number = indexArr[0] + addIndex;
            /** 如果处于最上级(也就是顶层)那么位置将会调到最后一个,其实就是循环 */
            targetLocationIndex < 0 && (targetLocationIndex = dataSource.length -1);
            
            const preSource = cloneDeep(dataSource[targetLocationIndex]);
            const nextSource = cloneDeep(dataSource[indexArr[0]]);

            dataSource.splice(indexArr[0], 1, preSource);
            dataSource.splice(targetLocationIndex, 1, nextSource);
        } else if (indexArr.length > 1) {
            /**其他级别的目录移动 */
            let parent: any = dataSource;
            for(let i = 0; i < indexArr.length; i++) {
                if (i === indexArr.length - 1) {
                    const pChildren = parent.children;
                    let targetLocationIndex: number = indexArr[i] + addIndex;
                    targetLocationIndex < 0 && (targetLocationIndex = pChildren.length -1);

                    const preSource = cloneDeep(pChildren[targetLocationIndex]);
                    const nextSource = cloneDeep(pChildren[indexArr[i]]);

                    pChildren.splice(indexArr[i], 1, preSource);
                    pChildren.splice(targetLocationIndex, 1, nextSource);

                    this.buildDataSourceKey(parent);
                } else {
                    parent = dataSource[indexArr[i]];
                }
            }
        }

        this.setState({
            dataSource
        });
    }

    /** 
     * @callback
     * @desc 新增教材二级目录
     */
    public addCourseSecondaryDirectory = (record: ITableRecord) => {
        const item = addCourseFieldTemplate({needChildren: false});
        const index: number = this.state.dataSource.findIndex((source: IDataSource) => source.key === record.key);
        
        if (index > -1) {
            const dataSource = cloneDeep(this.state.dataSource);

            (dataSource[index].children!).push(item);

            this.buildDataSourceKey(dataSource[index]);

            this.setState({
                dataSource
            });
        }
    };

    /** 
     * @callback
     * @desc 课程修改完成
     */
    public modifyCourseComplete = (form: any, record: ITableRecord) => {
        form.validateFields((error: any, row: any) => {
            if (error) {
                return;
            }

            const indexArr: number[] = this.getCurrentItemIndex(record);

            if (indexArr.length > 0) {
                const dataSource = cloneDeep(this.state.dataSource);
                let parent: any = dataSource;

                for(let i = 0; i < indexArr.length; i++) {
                    if (i === indexArr.length - 1) {
                        const index: number = indexArr[i];

                        if (i === 0) {
                            const item = dataSource[index];
                            dataSource.splice(index, 1, {
                                ...item,
                                ...row
                            });
                        } else if (i > 0) {
                            const item = parent.children[index];
                            parent.children.splice(index, 1, {
                                ...item,
                                ...row
                            });
                        }
                    } else {
                        parent = dataSource[indexArr[i]];
                    }
                }

                this.setState({
                    dataSource,
                    editingKey: ''
                });
            }
        });
    }

    /** 
     * @callback
     * @desc 取消修改课程
     */
    public cancelModifyCourse = (record: ITableRecord) => {
        this.setState({ editingKey: '' });
    }

    /** 
     * @callback
     * @desc 编辑教程
     */
    public editCourse = (record: ITableRecord) => {
        this.setState({ editingKey: record.key });
    }

    /** 
     * @func
     * @desc 获取当前项在this.state.dataSource的位置
     */
    public getCurrentItemIndex = (record: ITableRecord): number[] => {
        const indexArr: number[] = [];
        const keys: string[] = record.key.split('');
        const repeatKeys = (courseList: ITableRecord[], keysIndex: number = 0) => {
            const matchKeys: string = keys.slice(0, keysIndex + 1).join('');
            const target = courseList.find((item: ITableRecord, index: number) => {
                if (item.key === matchKeys) {
                    indexArr.push(index);
                    return true;
                }

                return false;
            });

            if (target && target.children && target.children.length > 0) {
                repeatKeys(target.children, keysIndex + 1);
            }
        };

        repeatKeys(this.state.dataSource);

        return indexArr;
    }

    /** 
     * @callback
     * @desc 删除课程
     *        此删除功能是根据key来删除的
     *        例如： 父级key为'1',那么子级的key为'12',那么代表的是删除父级下的children中的第二个数据
     */
    public deleteCourse = (record: ITableRecord) => {
        const indexArr: number[] = this.getCurrentItemIndex(record);

        if (indexArr.length > 0) {
            let dataSource = cloneDeep(this.state.dataSource);
            let parent: any = dataSource;

            for(let i = 0; i < indexArr.length; i++) {
                if (i === indexArr.length - 1) {
                    i === 0 && (dataSource.splice(indexArr[i], 1));

                    if (i > 0) {
                        parent.children && parent.children.splice(indexArr[i], 1);
                        this.buildDataSourceKey(parent);
                    }
                } else {
                    parent = dataSource[indexArr[i]];
                }
            }

            this.setState({
                dataSource
            });
        }
    }

    /** 
     * @callback
     * @desc 重新组建数据源的key
     */
    public buildDataSourceKey = (source: IDataSource) => {
        if (source.children && source.children.length > 0) {
            const parentKey: string = source.key;
            source.children = source.children.map((child: IDataSource, index: number) => ({
                ...child,
                key: `${parentKey}${index}`
            }));

            return source;
        }

        return source;
    }

    public loadTeachingMenu(params = {}) {
        message.loading('加载数据中', 2);

        this.setState({
            isLoading: true
        });

        api.loadCourseDirectory(params).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    dataSource: res.data,
                    hasData: res.data.length > 0,
                    isLoading: false
                });

                message.info('加载完成');
            }
        });
    }

    /** 
     * @callback
     * @desc 搜素课程名 
     */
    public handleInputSearch = (e: any) => {
        // const { value } = e.target;
    }

    /** 
     * @callback
     * @desc 添加课程
     */
    public addCourse = () => {
        const course = addCourseFieldTemplate();

        const dataSource = [...this.state.dataSource];
        dataSource.unshift(course);
        dataSource.forEach((source: IDataSource, index: number) => {
            source.key = `${index}`;
            this.buildDataSourceKey(source);
        });

        this.setState({
            dataSource,
            hasData: true
        });
    }

    /** 
     * @callback
     * @desc 刷新数据
     */
    public refreshDataSource = () => {
        this.loadTeachingMenu();
    }

    /** 
     * @callback
     * @desc 重新渲染column
     */
    public renderColumns = () => {
        return this.config.columns.map((column: any) => {
            /**配置了editable属性的column不会被覆盖渲染 */
            if (!column.editable) {
                return column;
            }

            return {
                ...column,
                onCell: (record: any) => {
                    return {
                        record,
                        dataIndex: column.dataIndex,
                        title: record.name,
                        column_info: column,
                        editing: this.isEditing(record)
                    };
                }
            };
        });
    }

    public render() {
        const { hasData, dataSource, isLoading } = this.state;
        const components = {
            body: {
                cell: EditableCell
            }
        };

        return (
            <div className='directory-manage-container animateCss'>
                <div className='operation-box'>
                    <Row>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Button type='primary' className='btn-addCourse' onClick={this.addCourse}><SvgComponent className='add-course-svg' type='icon-add-directory' />添加课程</Button>
                            <Button type='primary' className='btn-save' onClick={this.globalNotify}><Icon type="save" />保存</Button>
                            <Button type='primary' className='btn-refresh' onClick={this.refreshDataSource}><Icon type="reload" />刷新</Button>
                        </Col>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Search style={{ marginBottom: 8 }} placeholder='输入内容快速定位教材目录节点' onChange={this.handleInputSearch} />
                        </Col>
                    </Row>
                </div>
                <div className='table-box'>
                    {
                        isLoading ? <>
                            <Skeleton />
                            <Skeleton />
                        </> : <EditableContext.Provider value={this.props.form}>
                                <Table
                                    components={components}
                                    columns={this.renderColumns()}
                                    dataSource={hasData ? dataSource : undefined }
                                    indentSize={24}
                                    pagination={false}
                                />
                            </EditableContext.Provider>
                    }
                </div>
                <div className='backTop-box'>
                    <BackTop />
                </div>
            </div>
        )
    }
}

export default Form.create()(DirectoryManageContainer);
