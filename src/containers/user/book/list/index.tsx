import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem, imgList, materialOperationMsg } from './index.config';
import { Divider, Radio, Icon, Skeleton, message, Breadcrumb, Select, Row, Col, Tag  } from 'antd';
import { PageComponent, IPageComponnetProps, IPageInfo, defaultPageInfo } from 'components/pagination/index';
import { cloneDeep } from 'lodash';
import { IBookListProps } from '../interface';
import { SvgComponent } from 'components/icon/icon';
import dayjs from 'dayjs';
import { defaultBookPic } from 'common/service/img-collection';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import { downloadFile } from 'common/utils/function';
import { ITeachChapterList } from 'common/api/api-interface';
import { handleMaterialOperation, IPromiseResolve } from 'common/service/material-operation-ajax';
import { BrowseFileModalComponent, IBrowseFileModalProps } from 'components/browse-file/browse-file';
import { debounce } from 'common/utils/function';
import './index.scss';

interface IState {
    type: string;
    format: string;
    filterConfig: any;
    sourceBooklist: ITeachChapterList[];
    booklist: ITeachChapterList[];
    pageInfo: IPageInfo;
    breadcrumb: string[];
    hasData: boolean;
    isLoading: boolean;
    modalVisible: boolean;
    currentViewSource: ITeachChapterList | null;
    searchCriteria: any;
    updateTime: number;
}

interface IConifg {
    maxScore: number;
    materialOperation: IDictionaryItem[];
    searchDebounce: any;
}

type ItypeStr = 'collect' | 'praise' | 'see' | 'download';

const { Option } = Select;

class BookListContainer extends React.PureComponent<IBookListProps, IState> {
    public config: IConifg;

    constructor(public props: IBookListProps) {
        super(props);

        this.state = {
            /** 资源类型 */
            type: '',
            /** 资源格式 */
            format: '',
            /** 搜索条件 */
            filterConfig: cloneDeep(filterConfig),
            /** 教材列表 */
            sourceBooklist: [],
            booklist: [],
            /** 分页 */
            pageInfo: { ...defaultPageInfo },
            breadcrumb: [],
            hasData: false,
            isLoading: false,
            modalVisible: false,
            currentViewSource: null,
            /** 搜索条件 */
            searchCriteria: {},
            updateTime: 0
        };

        this.config = {
            maxScore: 10,
            materialOperation: dictionary.get('material-operation')!,
            searchDebounce: debounce(1500)
        };
    }

    static getDerivedStateFromProps(nextProps: IBookListProps, prevState: IState) {
        if (nextProps.showList && nextProps.updateTime > prevState.updateTime) {
            const fileType: IDictionaryItem[] = dictionary.get('source-type')!;

            const result: ITeachChapterList[] = nextProps.showList.map((item: any) => {
                item.createTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
                item.title = item.name;
                item.coverLink = item.coverLink || defaultBookPic;
                item.fileFormatName = item.fileFormat ? (fileType.find((file: IDictionaryItem) => item.fileType === file.value)!).name : '';
                
                return {    
                    ...item
                };
            });

            return {
                breadcrumb: nextProps.breadcrumb,
                sourceBooklist: result,
                booklist: result.slice(0, 10),
                hasData: result.length > 0,
                isLoading: nextProps.isLoading === 'true' ? true : false,
                pageInfo: {
                    ...defaultPageInfo,
                    totalCount: result.length
                }
            }
        }

        return null;
    }

    /** 
     * @func
     * @desc 搜索条件点击
     */
    public filterBtnClick = (item: IFilterConfigItem, sourceKey: string, order: string) => {
        let items:IFilterConfigItem[] = this.state.filterConfig[sourceKey];

        items = items.map((i: IFilterConfigItem) => {
            /** order 用于排序的默认，点击上下箭头的变化 */
            const order: string = ((): string => {
                if (!i.selected) {
                    return 'down';
                }
                
                if (i.selected) {
                    const val: string = i.order === 'down' ? 'up' : 'down';
                    return val;
                }

                return '';
            })();

            return {
                ...i, 
                ...i.order && { order },
                selected: i.value === item.value,
            };
        });

        this.setState({
            filterConfig: {
                ...this.state.filterConfig,
                [sourceKey]: items
            }
        });

        const actualOrder = order === 'down' ? 'up' : 'down';
        this.filterDataSource({ name: sourceKey, value: String(item.value), order: actualOrder });
    }

    /** 
     * @func
     * @desc 单选发生变化
     */
    public radioGroupChange = (e: any) => {
        this.setState({
            format: e.target.value
        });

        this.filterDataSource({ name: 'format', value: e.target.value });
    }

    /**
     * @func
     * @desc 选择发生变化
     */
    public handleSelectChange = (e: any, sourceKey: string) => {
        if (sourceKey === 'format') {
            this.setState({
                format: e
            });
        } else if (sourceKey === 'type') {
            this.setState({
                type: e
            });
        }

        this.filterDataSource({ name: sourceKey, value: e });
    }

    /** 
     * @func
     * @desc 进行数据过滤
     */
    public filterDataSource = ({ name, value, order = '' }: { name: string; value: string, order?: string }) => {
        const { searchDebounce } = this.config;
        const { searchCriteria } = this.state;
        const currentSearchCriteria = {
            ...searchCriteria,
            [name]: value
        };

        this.setState({
            searchCriteria: currentSearchCriteria,
            isLoading: true,
            updateTime: Date.now()
        }, () => {
            searchDebounce(() => {
                let { sourceBooklist, pageInfo } = this.state;
                /** 如果原本无数据，则不需要排序筛选 */
                if (sourceBooklist.length === 0) {
                    this.setState({
                        isLoading: false,
                        updateTime: Date.now()
                    });

                    return;
                }

                 /** 条件 */
                const criteria = this.state.searchCriteria;
                let booklist: ITeachChapterList[] = [];

                /** 如果存在资源格式 */
                if (criteria.hasOwnProperty('format')) {
                    booklist = criteria.format === '' ?
                                sourceBooklist : sourceBooklist.filter((item: ITeachChapterList) => item.fileFormat === criteria.format);
                }

                /** 如果存在资源类型 */
                if (criteria.hasOwnProperty('type')) {
                    const source: ITeachChapterList[] =  booklist.length > 0 ? booklist : sourceBooklist;
                    booklist = criteria.type === '' ? source : source.filter((item: ITeachChapterList) => item.fileType === criteria.type);
                }

                /** 如果存在排序 */
                if (criteria.hasOwnProperty('sort')) {
                    const source: ITeachChapterList[] =  booklist.length > 0 ? booklist : sourceBooklist;
                    /** 这里如果使用的是default那么则不会进行排序 */
                    (source.length > 0 && value !== 'default') && source.sort((x: ITeachChapterList, y: ITeachChapterList) => {
                        if (value === 'time') {
                            return order === 'up' ? new Date(y.updateTime).getTime() - new Date(x.updateTime).getTime() :
                            new Date(x.updateTime).getTime() - new Date(y.updateTime).getTime();
                        }

                        return order === 'up' ? y.downloadCount - x.downloadCount : x.downloadCount - y.downloadCount;
                    });
                    
                    booklist = source;
                }

                this.setState({
                    booklist,
                    pageInfo: {
                        ...pageInfo,
                        currentPage: 1,
                        totalCount: booklist.length
                    },
                    hasData: booklist.length > 0,
                    isLoading: false,
                    updateTime: Date.now()
                });
            });
        });
    }

    /** 
     * @func
     * @desc 分页发生变化
     */
    public pageChange = (page: number, pageSize?: number) => {
        const { sourceBooklist } = this.state;
        this.setState({
            booklist: sourceBooklist.slice((page - 1)*pageSize!, page*pageSize!),
            pageInfo: {
                ...this.state.pageInfo,
                currentPage: page,
                ...pageSize && {
                    pageSize
                }
            },
            updateTime: Date.now()
        });
    }

    /** 
     * @func
     * @desc 收藏 点赞 阅读 下载
     */
    public handleMaterialOperation = (item: ITeachChapterList, typeStr: ItypeStr) => {
        const canMessage: boolean = typeStr === 'collect' || typeStr === 'praise';

        handleMaterialOperation({ operation: typeStr, sourceItem: item }).then(({ bool, desc }: IPromiseResolve) => {
            if (bool && canMessage) {
                let { booklist } = this.state;
                booklist = booklist.map((book: ITeachChapterList) => {
                    if (item.chapterId === book.chapterId) {
                        typeStr === 'praise' && (book.isPraise = !book.isPraise);
                        typeStr === 'collect' && (book.isCollect = !book.isCollect);
                    }
                    
                    return book;
                });

                this.setState({
                    booklist: cloneDeep(booklist),
                    updateTime: Date.now()
                });

                message.success(this.buildString(typeStr, 'success'));
            } else {
                canMessage && message.error(this.buildString(typeStr, 'error'));
            }
        });

        /** 下载 */
        if (typeStr === 'download') {
           this.dowmloadFile(item);
        }

        /** 阅读 */
        if (typeStr === 'see') {
            this.showDetail(item);
        }
    }

    /** 
     * @func
     * @desc 构建提示语
     */
    public buildString = (typeStr: ItypeStr, status: 'success' | 'error' ): string => {
        return materialOperationMsg[status][typeStr];
    }

    /** 
     * @func
     * @desc 查看详情
     */
    public showDetail = (item: ITeachChapterList) => {
        this.setState({
            modalVisible: true,
            currentViewSource: {...item, url: item.link},
            updateTime: Date.now()
        });
    }

    /** 
     * @func
     * @desc 下载文件
     */
    public dowmloadFile = (item: ITeachChapterList) => {
        downloadFile({ fileName: item.name, fileFormat: item.fileFormat, url: item.link });
    }

    /** 
     * @func
     * @desc 构建过滤条件
     * @params 
     *      items   数据源
     *      type    组件的类型
     *      state   this.state
     */
    public buildfilterContent = ({ sourceKey, componentType: type, state= '' }: { sourceKey: string, componentType: string, state?: any }) => {
        const items: Array<IFilterConfigItem> = this.state.filterConfig[sourceKey];

        return <div className='filter-item-content'>
                    {
                        (type === 'common' || type === undefined) &&
                        items.map((item: IFilterConfigItem, index: number) => {
                            const spanContent:React.ReactNode = <span key={item.value} className={`${item.selected ? 'selected' : ''}`} 
                                                                    onClick={() => this.filterBtnClick(item, sourceKey, item.order || '')}>
                                                                    { item.name }
                                                                    { item.order && <Icon type={`arrow-${item.order}`} /> }
                                                                </span>;

                            return <React.Fragment key={`${item.value}-fragment`}>
                                    { index !== 0 && <Divider type="vertical" key={`${item.value}-divider`}/> }
                                    { spanContent }
                                </React.Fragment>
                        })
                    }
                    {
                        type === 'radio' && <Radio.Group options={items as any} onChange={this.radioGroupChange} value={state}></Radio.Group>
                    }
                    {
                        type === 'select' && <Select 
                                                showSearch
                                                style={{ width: 150 }}
                                                filterOption={(input, option) => this.filterOption(input, option)}
                                                onChange={(e) => this.handleSelectChange(e, sourceKey)}>
                                                {
                                                    items.map((item: IFilterConfigItem, index: number) => {
                                                        return <Option value={item.value} key={`${item.value}-${index}`}>{item.name}</Option>
                                                    })
                                                }
                                            </Select>
                    }
                </div>
    }

    /** 
     * @func
     * @desc 筛选项条件过滤
     */
    public filterOption = (input: string, option: any): boolean => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    public handleModalOk = () => {
        this.setState({
            modalVisible: false,
            updateTime: Date.now()
        });
    }

    public handleModalCancel = () => {
        this.setState({
            modalVisible: false,
            updateTime: Date.now()
        });
    }

    public render() {
        const pageComponentProps: IPageComponnetProps = {
            ...this.state.pageInfo,
            pageChange: this.pageChange
        };

        const { format, booklist, hasData, isLoading, breadcrumb, modalVisible, currentViewSource } = this.state;

        const browseFileModalProps: IBrowseFileModalProps = {
            handleOkCallBack: this.handleModalOk,
            handleCancelCallBack: this.handleModalCancel,
            modalVisible,
            source: currentViewSource,
            title: '',
            ...currentViewSource && {
                title: currentViewSource.title
            }
        }; 

        return <div className='book-list'>
                    <div className='filter-box'>
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
                        <div className='filter-box-type-format '>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <label>资源类型：</label>
                                    { this.buildfilterContent({ sourceKey: 'type', componentType: 'select'}) }
                                </Col>
                                <Col span={8}>
                                    <label>资源格式：</label>
                                    { this.buildfilterContent({ sourceKey: 'format', componentType: 'select', state: format }) }
                                </Col>
                            </Row>
                        </div>
                        <div className='filter-box-sort'>
                            <label>排序方式：</label>
                            { this.buildfilterContent({ sourceKey: 'sort', componentType: 'common'}) }
                        </div>
                    </div>

                    <div className='booklist-container'>
                        {
                            isLoading ? <div className='booklist-container-skeleton'>
                                <Skeleton active/>
                                <Skeleton active/>
                            </div> : hasData ? booklist.map((item: ITeachChapterList) => {
                                return <div className='booklist-item' key={item.id}>
                                            <div className='booklist-item-top'>
                                                <div className='booklist-item-top-left'>
                                                    <span>{ item.title }</span>
                                                    <Tag className='booklist-item-fileFormat' color='red'>{ item.fileFormatName }</Tag>
                                                </div>
                                            </div>
                                            <div className='booklist-item-bottom'>
                                                <img alt='封面' src={item.coverLink} />
                                                <div className='booklist-item-bottom-right'>
                                                    <span className='desc'>{item.desc || '暂无简介'}</span>
                                                    <div className='booklist-item-bottom-right-detail'>
                                                        <span>{item.createTime}</span>
                                                        <Divider type="vertical"/>
                                                        <span>大小：{item.size}</span>
                                                        <Divider type="vertical"/>
                                                        <span>浏览量：{item.viewCount > 999 ? '999+' : item.viewCount}</span>
                                                        <Divider type="vertical"/>
                                                        <span>下载：{item.downloadCount > 999 ? '999+' : item.downloadCount}</span>
                                                        <Divider type="vertical"/>
                                                        <span>点赞：{item.fabulousCount > 999 ? '999+' : item.fabulousCount}</span>
                                                        <Divider type="vertical"/>
                                                        <span>收藏：{item.collectionCount > 999 ? '999+' : item.collectionCount}</span>
                                                    </div>
                                                    {/* <p className='contributor'>贡献者：{item.contributors}</p> */}
                                                </div>
                                            </div>
                                            <div className='booklist-operation'>
                                                <div className={`booklist-operation-item ${item.isCollect ? 'selected' : ''}`} onClick={() => this.handleMaterialOperation(item, 'collect')}>
                                                    <SvgComponent className='icon-svg' type='icon-collect'/>
                                                    <p>收藏</p>
                                                </div>
                                                <div className={`booklist-operation-item ${item.isPraise ? 'selected' : ''}`} onClick={() => this.handleMaterialOperation(item, 'praise')}>
                                                    <SvgComponent className='icon-svg' type='icon-praise'/>
                                                    <p>点赞</p>
                                                </div>
                                                <div className={`booklist-operation-item`} onClick={() => this.handleMaterialOperation(item, 'see')}>
                                                    <SvgComponent className='icon-svg' type='icon-see'/>
                                                    <p>查看</p>
                                                </div>
                                                <div className={`booklist-operation-item`} onClick={() => this.handleMaterialOperation(item, 'download')}>
                                                    <SvgComponent className='icon-svg' type='icon-download'/>
                                                    <p>下载</p>
                                                </div>
                                            </div>
                                        </div>
                            }) :
                            <div className='noData'>
                                <img alt='无数据' src={imgList.noData} />
                                <p>暂时还没有符合条件的教学资源，请在左侧课程目录选择相关内容</p>
                            </div>
                        }
                    </div>
                    { modalVisible && <BrowseFileModalComponent {...browseFileModalProps}/> }
                    {
                        booklist.length > 0 && <div className='booklist-pagination'>
                            <PageComponent {...pageComponentProps}/>
                        </div>
                    }
                </div>
    }
}

function mapStateToProps(state: any) {
    const { showList = [], isLoading, breadcrumb = [], updateTime } = state.chapterMaterial.chaperMaterial;

    return {
        breadcrumb,
        showList,
        isLoading,
        updateTime
    }
}

export default connect(
    mapStateToProps
)(BookListContainer);
