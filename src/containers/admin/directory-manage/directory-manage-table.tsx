import * as React from 'react';
import { api } from 'common/api/index';
import { cloneDeep } from 'lodash';
import { Table, Divider, Icon, Row, Col, Popconfirm, BackTop, Skeleton, Form, Button } from 'antd';
import { columns, IConfig, ITableRecord, addCourseFieldTemplate } from './directory-manage-config';
import { SvgComponent } from 'components/icon/icon';
import './directory-manage-table.scss';
import { EditableContext, EditableCell } from './editableCell';
import { loadMaterialMenu } from 'common/service/tree-ajax';
import { messageFunc } from 'common/utils/function';
import { IMaterialSectionResponseResult, IChapterResponseDtoListItem,
    ISectionItem, IDeleteChapterOrSectionRequest, IDeleteChapterOrSectionResponseResult,
    IAddChapterAllRequest, IAddChapterAllChapterRequestDtoList, IAddChapterAllRequestResult,
    IUpdateChapterAllChapterResponseList, IUpdateChapterAllRequest,
    ITeachChapterList } from 'common/api/api-interface';

interface IDirectoryManageProps {
    [key: string]: any;
}

interface IDataSource {
    name: string;
    key: string;
    value: any;
    weight: number;
    id: number | null;
    teachChapterList?: any[];
    loaded: boolean;
    desc: string;
    pic: string;
    contributors: string;
    score: string;
    size: string;
    type: string;
    children?: IDataSource[];
    materialId?: string;
    [key: string]: any;
}

interface IState {
    dataSource: IDataSource[];
    hasData: boolean;
    isLoading: boolean;
    isSaving: boolean;
    editingKey: string;
    expandedRowKeys: string[];
    canExpandedRowKeys: boolean;
}

// const { Search } = Input;

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
            isSaving: false,
            editingKey: '',
            expandedRowKeys: [],
            canExpandedRowKeys: true
        };
    }

    public componentDidMount() {
        this.loadTeachingMenu();
    }

    // public globalNotify = () => {
    //     const key: string = `open${Date.now()}`;
    //     const btn: React.ReactNode = (
    //         <Button type="primary" size="small" onClick={() => this.saveAllCourse(key)}>
    //             确认
    //         </Button>
    //     );
    //     notification.open({
    //         message: `课程修改保存`,
    //         description: '保存以后，数据将存储到数据库中，请确认自己的修改无误',
    //         key,
    //         btn,
    //         duration: null
    //     });
    // }

    /**
     * @callback
     * @desc 保存所有修改的课程数据
     */
    // public saveAllCourse = (key: string) => {
    //     notification.close(key);

    //     const dataSource: IUpdateChapterAllRequest[] = this.state.dataSource.map((item) => {
    //         return {
    //             chapterResponseDtoList: [],
    //             teachMaterial: {
    //                 contributors: item.contributors,
    //                 desc: item.desc,
    //                 materlId: item.materlId,
    //                 pic: item.pic,
    //                 score: item.score,
    //                 size: item.size,
    //                 title: item.title,
    //                 type: item.type,
    //                 weight: item.weight
    //             }
    //         };
    //     });

    //     const requestArr: Array<Promise<any>> = dataSource.map((params: IUpdateChapterAllRequest) => {
    //         return api.updateChapterAll(params);
    //     });

    //     const loading = messageFunc();

    //     Promise.all(requestArr).then((res: IAddChapterAllRequestResult[]) => {
    //         if (res.every((resItem: IAddChapterAllRequestResult) => resItem.status === 200 && resItem.data.success)) {
    //             loading.success('课程权重保存完成');
    //         } else {
    //             loading.error('存在课程权重保存失败');
    //         }
    //     });
    // }

    /** 
     * @callback
     * @desc 保存所有的课程
     */
    public saveTotalCourse = () => {
        const newSource: IDataSource[] = [];
        const oldSource: IDataSource[] = [];
        const { dataSource } = this.state;
        
        dataSource.forEach((item: IDataSource) => {
            item.id && oldSource.push(item);
            !item.id && newSource.push(item);
        });

        const newSourceFormat: IAddChapterAllRequest[] = this.newSourceFormat(newSource);
        const newSourceRequestArr: Array<Promise<any>> = newSourceFormat.map((params: IAddChapterAllRequest) => {
            return api.addChapterAll(params);
        });

        const oldSourceFormat: IUpdateChapterAllRequest[] = this.oldSourceFormat(oldSource);
        const oldSourceRequestArr: Array<Promise<any>> = oldSourceFormat.map((params: IUpdateChapterAllRequest) => {
            return api.updateChapterAll(params);
        });

        const loading = messageFunc();
        this.setState({
            isSaving: true
        });
        
        Promise.all([...newSourceRequestArr, ...oldSourceRequestArr]).then((res: IAddChapterAllRequestResult[]) => {
            if (res.every((resItem: IAddChapterAllRequestResult) => resItem.status === 200 && resItem.data.success)) {
                loading.success('保存成功！');
            } else {
                loading.error('存在失败的保存');
            }
        }).finally(() => {
            this.setState({
                isSaving: false
            });

            this.loadTeachingMenu();
        });
    }

    /** 
     * @func
     * @desc format新增的数据
     */
    public newSourceFormat = (source: IDataSource[]): IAddChapterAllRequest[] => {
        return source.map((item: IDataSource) => {
            const chapterResponseDtoList: IAddChapterAllChapterRequestDtoList[] = (item.children || []).reduce((pre: Array<{ section: any }>,cur: IDataSource) => {
                const item = {
                    name: cur.name,
                    type: 1,
                    weight: 10
                };
    
                return pre.concat({ section: item });
            }, []);

            const params: IAddChapterAllRequest = {
                chapterResponseDtoList,
                teachMaterial: {
                    title: item.name,
                    type: 'Type1'
                }
            };

            return params;
        });
    }

    /** 
     * @func
     * @desc format老旧的数据
     */
    public oldSourceFormat = (source: IDataSource[]): IUpdateChapterAllRequest[] => {
        return source.map((sourceItem: IDataSource) => {
            const chapterResponseDtoList: IUpdateChapterAllChapterResponseList[] = (sourceItem.children || []).reduce((pre: Array<{ section: any }>,cur: IDataSource) => {
                const item = {
                    section: {
                        chapterId: cur.value,
                        materialId: sourceItem.value,
                        name: cur.name,
                        parentId: sourceItem.value,
                        type: 1,
                        weight: cur.weight,
                        id: cur.id
                    },
                    ...cur.teachChapterList && { teachChapterList: cur.teachChapterList.map((i: ITeachChapterList) => {
                        return {
                            chapterId: i.chapterId,
                            materialId: i.materialId,
                            name: i.name,
                            parentId: i.parentId,
                            type: i.type,
                            weight: i.weight,
                            id: i.id
                        };
                    }) }
                }; 
                return pre.concat(item);
            }, []);

            const params: IUpdateChapterAllRequest = {
                chapterResponseDtoList,
                teachMaterial: {
                    contributors: sourceItem.contributors,
                    desc: sourceItem.desc,
                    materlId: sourceItem.materlId,
                    pic: sourceItem.pic,
                    score: sourceItem.score,
                    size: sourceItem.size,
                    title: sourceItem.title,
                    type: sourceItem.type,
                    weight: sourceItem.weight
                }
            };

            return params;
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
                const editable = this.isEditing(record);

                return <span className='table-operation-box'>
                            <Popconfirm title='请确认删除。' onConfirm={() => this.deleteCourse(record)} okText='确认' cancelText='取消'><Icon className='operation-box-icon' type='delete' />
                                { record.children ? '删除课程' : '删除章节' }
                            </Popconfirm>
                            <Divider type='vertical' />
                            {
                                record.children && <>
                                    <p onClick={() => this.addCourseSecondaryDirectory(record)}><Icon className='operation-box-icon' type='plus' />新增章节</p>
                                    <Divider type='vertical' />
                                </>
                            }
                            {
                                editable ? <>
                                    <EditableContext.Consumer>
                                        {
                                            form => (
                                                <p className={record.children? 'chapter-parent': ''} onClick={() => this.modifyCourseComplete(form, record)}><Icon className='operation-box-icon' type='save' />保存修改</p>
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
        let dataSource = cloneDeep(this.state.dataSource);

        /** 最高级的目录移动 */
        if (indexArr.length === 1) {    
            let targetLocationIndex: number = indexArr[0] + addIndex;
            /** 如果处于最上级(也就是顶层)那么位置将会调到最后一个,其实就是循环 */
            targetLocationIndex < 0 && (targetLocationIndex = dataSource.length -1);
            
            const preSource = cloneDeep(dataSource[targetLocationIndex]);
            const nextSource = cloneDeep(dataSource[indexArr[0]]);

            dataSource.splice(indexArr[0], 1, preSource);
            dataSource.splice(targetLocationIndex, 1, nextSource);

            dataSource = dataSource.map((item: IDataSource, index: number) => {
                item.weight = dataSource.length + 100 - index;
                return item;
            });
        } else if (indexArr.length > 1) {
            /**其他级别的目录移动 */
            let parent: any = dataSource;
            for(let i = 0; i < indexArr.length; i++) {
                if (i === indexArr.length - 1) {
                    let pChildren = parent.children;
                    let targetLocationIndex: number = indexArr[i] + addIndex;
                    targetLocationIndex < 0 && (targetLocationIndex = pChildren.length -1);

                    const preSource = cloneDeep(pChildren[targetLocationIndex]);
                    const nextSource = cloneDeep(pChildren[indexArr[i]]);

                    pChildren.splice(indexArr[i], 1, preSource);
                    pChildren.splice(targetLocationIndex, 1, nextSource);

                    pChildren = pChildren.map((item: IDataSource, index: number) => {
                        item.weight = pChildren.length - index + 10;
                        return item;
                    });

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

            const canExpandedRowKeys: boolean = (() => {
                if (record.id === null || record.loaded) {
                    return true;
                }

                return false;
            })();
            
            const keys = (record.children || []).map((item) => item.key);

            this.setState({
                dataSource,
                expandedRowKeys: [record.key].concat(keys),
                canExpandedRowKeys
            });

            // this.setState({
            //     dataSource
            // });
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

            /** 如果是课程修改 那么将调用接口保存其下的所有章节 */
            // if (record.key.split('-').length === 1) {
            //     /** 新增 */
            //     !record.id && this.addChapterAll(record, row);
            //     /** 修改 */
            //     record.id && this.updateChapterAll(record, row);
            // } else {
               
            // }

            /** 如果是课程的章节修改，则前端表面保存 */
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
     * @func
     * @desc 新建教材全集
     */
    // public addChapterAll = (record: ITableRecord, row: any) => {
    //     const chapterResponseDtoList: IAddChapterAllChapterRequestDtoList[] = (record.children || []).reduce((pre,cur: IDataSource) => {
    //         const item = {
    //             name: cur.name,
    //             type: 1,
    //             weight: 10
    //         };

    //         return pre.concat({ section: item });
    //     }, []);

    //     const params: IAddChapterAllRequest = {
    //         chapterResponseDtoList,
    //         teachMaterial: {
    //             title: row.name,
    //             type: 'Type1'
    //         }
    //     };

    //     const loading = messageFunc();

    //     api.addChapterAll(params).then((res: IAddChapterAllRequestResult) => {
    //         if (res.status === 200 && res.data.success) {
    //             loading.success(res.data.desc);
    //             this.loadTeachingMenu();
    //         } else {
    //             loading.error(res.data.desc);
    //         }
    //     });
    // }

    /** 
     * @func
     * @desc 更新教材全集
     */
    // public updateChapterAll = (record: ITableRecord, row: any) => {
    //     const chapterResponseDtoList: IUpdateChapterAllChapterResponseList[] = (record.children || []).reduce((pre,cur: IDataSource) => {
    //         const item = {
    //             section: {
    //                 chapterId: cur.value,
    //                 materialId: record.value,
    //                 name: cur.name,
    //                 parentId: record.value,
    //                 type: 1,
    //                 weight: cur.weight,
    //                 id: cur.id
    //             },
    //             ...cur.teachChapterList && { teachChapterList: cur.teachChapterList.map((i: ITeachChapterList) => {
    //                 return {
    //                     chapterId: i.chapterId,
    //                     materialId: i.materialId,
    //                     name: i.name,
    //                     parentId: i.parentId,
    //                     type: i.type,
    //                     weight: i.weight,
    //                     id: i.id
    //                 };
    //             }) }
    //         }; 
    //         return pre.concat(item);
    //     }, []);

    //     const loading = messageFunc();

    //     const params: IUpdateChapterAllRequest = {
    //         chapterResponseDtoList,
    //         teachMaterial: {
    //             materlId: record.value,
    //             desc: record.desc,
    //             pic: record.pic,
    //             contributors: record.contributors,
    //             score: record.score,
    //             size: record.size,
    //             title: row.name,
    //             type: record.type,
    //             weight: record.weight
    //         }
    //     };

    //     api.updateChapterAll(params).then((res: IAddChapterAllRequestResult) => {
    //         if (res.status === 200 && res.data.success) {
    //             loading.success(res.data.desc);
    //             this.loadTeachingMenu();
    //         } else {
    //             loading.error(res.data.desc);
    //         }
    //     });
    // }

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
        this.setState({ 
            editingKey: record.key
        });
    }

    /** 
     * @func
     * @desc 获取当前项在this.state.dataSource的位置
     */
    public getCurrentItemIndex = (record: ITableRecord): number[] => {
        const indexArr: number[] = [];
        const keys: string[] = record.key.split('-');
        const repeatKeys = (courseList: ITableRecord[], keysIndex: number = 0) => {
            const matchKeys: string = keys.slice(0, keysIndex + 1).join('-');
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
        const keysArr: string[] = record.key.split('-');

        if (keysArr.length === 1) {
            const loading = messageFunc();
            const params: IDeleteChapterOrSectionRequest = {
                id: record.value,
                type: 15
            };
    
            api.deleteChapterOrSection(params).then((res: IDeleteChapterOrSectionResponseResult) => {
                if (res.status === 200 && res.data.success) {
                    this.loadTeachingMenu();
                    loading.success(res.data.desc);
                } else {
                    loading.error(res.data.desc);
                }
            });
        } else {
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
                key: `${parentKey}-${index}`
            }));

            return source;
        }

        return source;
    }

    /**
     * @func
     * @desc 加载课程
     * @param params 
     */
    public loadTeachingMenu(params = {}) {
        const loading = messageFunc();

        this.setState({
            isLoading: true
        });

        loadMaterialMenu().then((res: IDataSource[]) => {
            let state = {
                isLoading: false
            };

            /** 这边对key重置一下 */
            const dataSource: IDataSource[] = res.map((item: IDataSource, index: number) => {
                item.key = String(index);
                item.loaded = false;
                return item;
            }).sort((x: IDataSource, y: IDataSource) => {
                return y.weight - x.weight;
            });

            dataSource.length && (state = {...state, ...{
                dataSource,
                hasData: dataSource.length > 0
            }});

            this.setState({
                ...state,
                editingKey: '',
                canExpandedRowKeys: false
            });

            loading.success();
        });
    }

    /** 
     * @callback
     * @desc 展开加载相关课程的章节
     */
    public handleTableItemExpand = (expanded: boolean, record: IDataSource) => {
        this.setState({
            canExpandedRowKeys: false
        });

        if (expanded && !record.loaded) {
            const loading = messageFunc();
            const params: FormData = new FormData();
            params.set('id', record.value);

            api.sectionList(params).then((res: IMaterialSectionResponseResult) => {
                if (res.status === 200 && res.data.success) {
                    const { chapterResponseDtoList }: { chapterResponseDtoList: IChapterResponseDtoListItem[] } = res.data.result;
                    const value = record.value;
                    const menus: IDataSource[] = chapterResponseDtoList.map((chapter: IChapterResponseDtoListItem, index: number) => {
                        const item: ISectionItem = chapter.section;
                        return {
                            name: item.name,
                            key: `${record.key}-${index}`,
                            value: item.chapterId,
                            id: item.id,
                            isLeaf: true,
                            weight: item.weight,
                            teachChapterList: chapter.teachChapterList,
                            desc: item.desc,
                            pic: item.pic,
                            contributors: item.co,
                            score: item.s,
                            size: item.size,
                            type: String(item.type),
                            loaded: true,
                            materialId: item.materialId
                        };
                    }).sort((x: IDataSource, y: IDataSource) => {
                        return y.weight - x.weight;
                    });

                    const { dataSource } = this.state; 
                    const menusState: IDataSource[] = cloneDeep(dataSource);
                    const target: IDataSource = menusState.find((item: IDataSource) => item.value === value)!;
                    target.children! = menus;
                    target.loaded = true;

                    this.setState({
                        dataSource: menusState
                    });

                    loading.success(res.data.desc);
                } else {
                    loading.error(res.data.desc);
                }
            });
        }
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
        const { hasData, dataSource, isLoading, isSaving, expandedRowKeys, canExpandedRowKeys } = this.state;
        const components = {
            body: {
                cell: EditableCell
            }
        };
        const otherTableProps = {
            ...canExpandedRowKeys && {
                expandedRowKeys
            }
        };

        return (
            <div className='directory-manage-container animateCss'>
                <div className='operation-box'>
                    <Row>
                        <Col className='operation-box-col' sm={24} md={12}>
                            <Button type='primary' className='btn-addCourse' onClick={this.addCourse}><SvgComponent className='add-course-svg' type='icon-add-directory' />添加课程</Button>
                            <Button type='primary' className='btn-save' onClick={this.saveTotalCourse} disabled={isSaving}><Icon type="save" />保存课程</Button>
                            {/* <Button type='primary' className='btn-save' onClick={this.globalNotify}><Icon type="save" />保存课程权重</Button> */}
                            <Button type='primary' className='btn-refresh' onClick={this.refreshDataSource}><Icon type="reload" />刷新</Button>
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
                                    {...otherTableProps}
                                    components={components}
                                    columns={this.renderColumns()}
                                    dataSource={hasData ? dataSource : undefined }
                                    indentSize={24}
                                    pagination={false}
                                    loading={isLoading}
                                    onExpand={this.handleTableItemExpand}
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
