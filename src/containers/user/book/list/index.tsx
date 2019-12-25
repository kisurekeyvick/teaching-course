import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem, imgList } from './index.config';
import { Divider, Radio, Icon, Skeleton, message, Breadcrumb } from 'antd';
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
import './index.scss';

interface IState {
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
    updateTime: number;
}

interface IConifg {
    maxScore: number;
    materialOperation: IDictionaryItem[]
}

class BookListContainer extends React.PureComponent<IBookListProps, IState> {
    public config: IConifg;

    constructor(public props: IBookListProps) {
        super(props);

        this.state = {
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
            updateTime: 0
        };

        this.config = {
            maxScore: 10,
            materialOperation: dictionary.get('material-operation')!
        };
    }

    static getDerivedStateFromProps(nextProps: IBookListProps, prevState: IState) {
        if (nextProps.showList && nextProps.updateTime > prevState.updateTime) {
            const result: ITeachChapterList[] = nextProps.showList.map((item: any) => {
                item.createTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
                item.title = item.name;
                item.coverLink = item.coverLink || defaultBookPic;
                return {    
                    ...item
                }
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
    public filterBtnClick = (item: IFilterConfigItem, sourceKey: string) => {
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
    }

    /** 
     * @func
     * @desc 单选发生变化
     */
    public radioGroupChange = (e: any) => {
        this.setState({
            format: e.target.value
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
    public handleMaterialOperation = (item: ITeachChapterList, typeStr: 'collect' | 'praise' | 'see' | 'download') => {
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

                message.success(desc);
            } else {
                canMessage && message.error(desc);
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
                        (type === 'common' || type === undefined) ?
                        items.map((item: IFilterConfigItem, index: number) => {
                            const spanContent:React.ReactNode = <span key={item.value} className={`${item.selected ? 'selected' : ''}`} 
                                                                    onClick={() => this.filterBtnClick(item, sourceKey)}>
                                                                    { item.name }
                                                                    { item.order && <Icon type={`arrow-${item.order}`} /> }
                                                                </span>;

                            return <React.Fragment key={`${item.value}-fragment`}>
                                    { index !== 0 && <Divider type="vertical" key={`${item.value}-divider`}/> }
                                    { spanContent }
                                </React.Fragment>
                        }) :
                        type === 'radio' && <Radio.Group options={items as any} onChange={this.radioGroupChange} value={state}></Radio.Group>
                    }
                </div>
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
                        <div className='filter-box-type'>
                            { this.buildfilterContent({ sourceKey: 'type', componentType: 'common'}) }
                        </div>
                        <div className='filter-box-format'>
                            <label>资源格式：</label>
                            { this.buildfilterContent({ sourceKey: 'format', componentType: 'radio', state: format }) }
                        </div>
                        <div className='filter-box-sort'>
                            <label>排序：</label>
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
                                                </div>
                                            </div>
                                            <div className='booklist-item-bottom'>
                                                <img alt='缩略图' src={item.coverLink} />
                                                <div className='booklist-item-bottom-right'>
                                                    <span className='desc'>{item.desc || '暂无简介'}</span>
                                                    <div className='booklist-item-bottom-right-detail'>
                                                        <span>{item.createTime}</span>
                                                        <Divider type="vertical"/>
                                                        <span>大小：{item.size}</span>
                                                        <Divider type="vertical"/>
                                                        <span>浏览量：{item.viewCount}</span>
                                                        <Divider type="vertical"/>
                                                        <span>下载：{item.downloadCount}</span>
                                                    </div>
                                                    <p className='contributor'>贡献者：{item.contributors}</p>
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
                                <p>很抱歉没有符合条件的教材</p>
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
