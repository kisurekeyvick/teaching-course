import * as React from 'react';
import { api } from 'common/api/index';
import { cloneDeep } from 'lodash';
import { Table, Input, Divider, Icon, Row, Col, Popconfirm, BackTop, Skeleton, Form} from 'antd';
import { columns, IConfig, ITableRecord } from './directory-manage-config';
import { SvgComponent } from 'components/icon/icon';
import './directory-manage-table.scss';
import { EditableContext, EditableCell } from './editableCell';

interface IDirectoryManageProps {
    [key: string]: any;
}

interface IState {
    dataSource: any[];
    hasData: boolean;
    isLoading: boolean;
    editingKey: string;
}

const { Search } = Input;

export default class DirectoryManageContainer extends React.PureComponent<IDirectoryManageProps, IState> {
    public config: IConfig;

    constructor(public props: IDirectoryManageProps) {
        super(props);

        this.config = {
            columns: this.rebuildTableColumns(cloneDeep(columns))
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

    /** 
     * @func
     * @desc 重新构建Table Column
     */
    public rebuildTableColumns = (columns: any[]): any[] => {
        const target = columns.find((item: any) => item.dataIndex === 'operation');
        const nameColumn = columns.find((item: any) => item.dataIndex === 'name');

        if (target) {
            target.render = (text: string, record: any) => {
                const { editingKey } = this.state;
                const editable = this.isEditing(record);

                return <span className='table-operation-box'>
                            <Popconfirm title='请确认删除。' onConfirm={() => this.deleteCourse(record)} okText='确认' cancelText='取消'><Icon className='operation-box-icon' type="delete" />删除</Popconfirm>
                            <Divider type="vertical" />
                            <p><Icon className='operation-box-icon' type="eye" />查看资源</p>
                            <Divider type="vertical" />
                            <p><Icon className='operation-box-icon' type="save" />修改完成</p>
                            <Divider type="vertical" />
                            {
                                record.children && <>
                                    <p><Icon className='operation-box-icon' type="plus" />新增二级目录页</p>
                                    <Divider type="vertical" />
                                </>
                            }
                            {
                                <EditableContext.Consumer>
                                    {
                                        form => (
                                            editable
                                        )
                                    }
                                </EditableContext.Consumer>
                            }
                            <p onClick={() => this.editCourse(record)}><Icon className='operation-box-icon' type="edit" />修改</p>
                            <Divider type="vertical" />
                            <p><Icon className='operation-box-icon' type="arrow-up" />上移</p>
                            <Divider type="vertical" />
                            <p><Icon className='operation-box-icon' type="arrow-down" />下移</p>
                        </span>
            };
        }

        if (nameColumn) {
            nameColumn.render = (text: string, record: any) => {
                if (record.isEdit) {
                    return <Input></Input>
                } else {
                    return text;
                }
            }
        }

        return columns;
    }

    /** 
     * @callback
     * @desc 是否处于编辑状态
     */
    public isEditing = (record: ITableRecord) => record.key === this.state.editingKey

    /** 
     * @callback
     * @desc 编辑教程
     */
    public editCourse = (record: ITableRecord) => {
        this.setState({ editingKey: record.key });
    }

    /** 
     * @callback
     * @desc 删除课程
     *        此删除功能是根据key来删除的
     *        例如： 父级key为'1',那么子级的key为'12',那么代表的是删除父级下的children中的第二个数据
     */
    public deleteCourse = (record: ITableRecord) => {
        const indexArr: number[] = [];
        const keys: string[] = record.key.split('');
        const repeatKeys = (courseList: ITableRecord[], keysIndex: number = 0) => {
            const matchKeys: string = keys.slice(0, keysIndex + 1).join('');
            const target = courseList.find((item: ITableRecord, index: number) => {
                if (item.key === matchKeys) {
                    indexArr.push(index);
                    return true;
                }
            });

            if (target && target.children && target.children.length > 0) {
                repeatKeys(target.children, keysIndex + 1);
            }
        };

        repeatKeys(this.state.dataSource);

        if (indexArr.length > 0) {
            let dataSource = cloneDeep(this.state.dataSource);
            let parent: any = dataSource;

            for(let i = 0; i<indexArr.length; i++) {
                if (i === indexArr.length - 1) {
                    i === 0 && (dataSource.splice(indexArr[i], 1));
                    i > 0 && (parent.children && parent.children.splice(indexArr[i], 1));

                    console.log('parent', parent);
                } else {
                    parent = dataSource[indexArr[i]];
                }
            }

            this.setState({
                dataSource
            });
        }
    }

    public loadTeachingMenu(params = {}) {
        api.loadCourseDirectory(params).then((res: any) => {
            if (res.status === 200) {
                this.setState({
                    dataSource: res.data,
                    hasData: res.data.length > 0,
                    isLoading: false
                });
            }
        });
    }

    /** 
     * @callback
     * @desc 搜素课程名 
     */
    public handleInputSearch = (e: any) => {
        const { value } = e.target;


    }

    /** 
     * @callback
     * @desc 添加课程
     */
    public addCourse = () => {
        const course = {
            name: 'demo',
            key: `${Date.now()}`,
            children:[]
        };

        const dataSource = [...this.state.dataSource];
        dataSource.push(course);

        this.setState({
            dataSource,
            hasData: true
        });
    }

    /** 
     * @callback
     * @desc 重新渲染column
     */
    public renderColumns = (columns: any[]) => {
        return columns.map((column: any) => {
            if (!column.editable) {
                return column;
            }

            return {
                ...column,
                onCell: (record: any) => ({
                    record,
                    dataIndex: record.dataIndex,
                    title: record.name,
                    editing: this.isEditing(record)
                })
            };
        })
    }

    public render() {
        const { hasData, dataSource } = this.state;
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
                            <div className='add-course-btn' onClick={this.addCourse}><SvgComponent className='add-course-svg' type='icon-add-directory' />添加课程</div>
                        </Col>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Search style={{ marginBottom: 8 }} placeholder='输入内容快速定位教材目录节点' onChange={this.handleInputSearch} />
                        </Col>
                    </Row>
                </div>
                <div className='table-box'>
                    {
                        this.state.isLoading ? <>
                            <Skeleton />
                            <Skeleton />
                        </> : <Table
                                    components={components}
                                    columns={this.config.columns.map(item => ({ ...item, ellipsis: item.ellipsis }))}
                                    dataSource={hasData ? dataSource : undefined }
                                    indentSize={24}
                                    pagination={false}
                                />
                    }
                </div>
                <div className='backTop-box'>
                    <BackTop />
                </div>
            </div>
        )
    }
}
