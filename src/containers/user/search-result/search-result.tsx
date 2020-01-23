import * as React from 'react';
import {connect} from 'react-redux';
import { Divider, Skeleton, Tag, Row, Col, message } from 'antd';
import { IDataSource } from './search-result.config';
import { PageComponent, IPageComponnetProps, IPageInfo, defaultPageInfo } from 'components/pagination/index';
import { api } from 'common/api/index';
import { IMaterialSearchRequest, IMaterialSearchResponse, IMaterialSearchList } from 'common/api/api-interface';
import { messageFunc, debounce, downloadFile } from 'common/utils/function';
import { defaultUserPic } from 'common/service/img-collection';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import dayjs from 'dayjs';
import { noData } from 'common/service/img-collection';
import { SvgComponent } from 'components/icon/icon';
import { handleMaterialOperation, IPromiseResolve } from 'common/service/material-operation-ajax';
import { BrowseFileModalComponent, IBrowseFileModalProps } from 'components/browse-file/browse-file';
import { EventEmitterList, bookSearchEventEmitter } from 'common/utils/eventEmitter/list';
import './search-result.scss';

interface ISearchResultProps {
    [key: string]: any;
}

interface IConfig {
    searchBookHistory: string;
    sourceType: IDictionaryItem[];
    sourceFormat: IDictionaryItem[];
    searchDebounce: any;
}

interface IState {
    searchSourceType: string;
    searchSourceFormat: string;
    dataSource: IDataSource[];
    hasData: boolean;
    isLoading: boolean;
    pageInfo: IPageInfo;
    modalVisible: boolean;
    currentViewSource: IDataSource | null;
    searchCount: number;
}

// const { Search } = Input;

class SearchResultContainer extends React.PureComponent<ISearchResultProps, IState> {
    public config: IConfig;

    constructor(public props: ISearchResultProps) {
        super(props);

        this.state = {
            searchSourceType: '',
            searchSourceFormat: '',
            dataSource: [],
            hasData: false,
            isLoading: false,
            /** 分页 */
            pageInfo: {...defaultPageInfo},
            modalVisible: false,
            currentViewSource: null,
            searchCount: 0
        };


        const sourceType = [...dictionary.get('source-type')!];
        sourceType.unshift({ name: '全部', value: '' });
        const sourceFormat = [...dictionary.get('source-format')!];
        sourceFormat.unshift({ name: '全部', value: '' });

        this.config = {
            searchBookHistory: '',
            sourceType,
            sourceFormat,
            searchDebounce: debounce(1500)
        };
    }

    public componentDidMount() {
        const self = this;

        bookSearchEventEmitter.on(EventEmitterList.SEARCHCOURSEEVENT, function(content: string) {
            self.config.searchBookHistory = content;

            const initParams = self.getMaterialSearchRequestParams();
            initParams.content = content;

            self.loadSearchResult(initParams);
        });
    }

    /** 
     * @func
     * @desc 加载搜索结果
     */
    public loadSearchResult = (params: IMaterialSearchRequest) => {
        const loading = messageFunc();

        this.setState({
            isLoading: true
        });

        api.materialSearch(params).then((res: IMaterialSearchResponse) => {
            if (res.status === 200 && res.data.success) {
                const { teachMaterialDto } = res.data.result;
                const dataSource: IDataSource[] = teachMaterialDto.list.map((item: IMaterialSearchList) => {
                    return {
                        title: item.name,
                        desc: item.desc,
                        id: item.id,
                        createTime: item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '',
                        contributors: item.contributors,
                        directory: `${item.materialName ? item.materialName + ' > ' : ''} ${item.chapterName || ''}`,
                        userImg: item.teacherLink || defaultUserPic,
                        url: item.link,
                        fileFormat: item.fileFormat,
                        chapterId: item.chapterId
                    }
                });

                const { pageInfo, searchCount } = this.state;
                const { total, pageNum } = teachMaterialDto;

                this.setState({
                    dataSource,
                    hasData: dataSource.length > 0,
                    isLoading: false,
                    pageInfo: {
                        ...pageInfo, ...{
                            currentPage: pageNum,
                            pageSize: params.pageInfo.pageSize,
                            totalCount: total
                        }
                    },
                    searchCount: searchCount + 1
                });

                loading.success(res.data.desc);
            } else {
                this.setState({
                    dataSource: [],
                    hasData: false,
                    isLoading: false,
                    pageInfo: {...defaultPageInfo}
                });

                loading.error(res.data.desc);
            }
        });
    }

    /** 
     * @func
     * @desc 获取搜索请求参数
     */
    public getMaterialSearchRequestParams = (): IMaterialSearchRequest => {
        const { searchSourceType, searchSourceFormat } = this.state;
        const { searchBookHistory } = this.config;
        const params: IMaterialSearchRequest = {
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            },
            content: searchBookHistory,
            fileFormat: searchSourceFormat,
            fileType: searchSourceType
        };

        return params;
    }

    /** 
     * @func
     * @desc 类型的搜索
     */
    public handleSpanClick = (filter: { sourceType?: string | number; sourceFormat?: string | number }) => {
        if (filter.hasOwnProperty('sourceType')) {
            this.setState({
                searchSourceType: String(filter.sourceType)
            });
        }

        if (filter.hasOwnProperty('sourceFormat')) {
            this.setState({
                searchSourceFormat: String(filter.sourceFormat)
            });
        }

        const { searchDebounce } = this.config;
        searchDebounce(() => {
            const params = this.getMaterialSearchRequestParams();
            this.loadSearchResult(params);
        });
    }

    /** 
     * @callback
     * @desc 输入框搜索
     */
    public searchBook = (e: string) => {
        const params = this.getMaterialSearchRequestParams();
        params.content = e;
        this.loadSearchResult(params);
    }

    /** 
     * @func
     * @desc 收藏 点赞 查看 下载
     */
    public handleMaterialOperation = (item: IDataSource, typeStr: 'collect' | 'praise' | 'see' | 'download') => {
        const otherParams: { isCollect?: boolean; isPraise?: boolean; } = {};
        let canMessage: boolean = false;
        
        if (typeStr === 'collect') {
            otherParams.isCollect = false;
            canMessage = true;
        }

        if (typeStr === 'praise') {
            otherParams.isPraise = false;
            canMessage = true;
        }

        handleMaterialOperation({ operation: typeStr, sourceItem: {
            chapterId: item.chapterId,
            ...otherParams
        } }).then(({ bool, desc }: IPromiseResolve) => {
            if (bool) {
                canMessage && message.success(desc);
            } else {
                canMessage && message.error(desc);
            }
        });

        /** 阅读 */
        if (typeStr === 'see') {
            this.showDetail(item);
        }

        /** 下载文件 */
        if (typeStr === 'download') {
            this.dowmloadFile(item);
        }
    }

    /** 
     * @func
     * @desc 查看详情
     */
    public showDetail = (item: IDataSource) => {
        this.setState({
            modalVisible: true,
            currentViewSource: item
        });
    }

    /** 
     * @func
     * @desc 下载文件
     */
    public dowmloadFile = (item: IDataSource) => {
        downloadFile({ fileName: item.title, fileFormat: item.fileFormat, url: item.url });
    }

    /** 
     * @func
     * @desc 分页发生变化
     */
    public pageChange = (page: number, pageSize?: number) => {
        const params: IMaterialSearchRequest = {
            ...this.getMaterialSearchRequestParams(),
            pageInfo: {
                pageNum: page,
                pageSize: pageSize || 10
            }
        }; 

        this.loadSearchResult(params);
    }

    /** 
     * @func
     * @desc 构建搜索结果项
     */
    public buildResultItems = (): React.ReactNode => {
        return this.state.dataSource.map((item: IDataSource, index: number) => {
            return <div key={`${item.id}-${index}`} className='content-item'>
                        <p className='content-item-title'>{item.title}</p>
                        <Row>
                            <Col xs={24} sm={12}>
                                <p className='content-item-desc'>{item.desc}</p>
                            </Col>
                        </Row>
                        <div className='content-item-other-info'>
                            <img src={item.userImg} alt='user-img'/>
                            <span className='contributor'>{item.contributors}</span>
                            <span className='directory'>{item.directory}</span>
                            <span className='createTime'>{item.createTime}</span>
                        </div>
                        <div className='searchList-operation'>
                            <div className={`searchList-operation-item`} onClick={() => this.handleMaterialOperation(item, 'collect')}>
                                <SvgComponent className='icon-svg' type='icon-collect'/>
                                <p>收藏</p>
                            </div>
                            <div className={`searchList-operation-item`} onClick={() => this.handleMaterialOperation(item, 'praise')}>
                                <SvgComponent className='icon-svg' type='icon-praise'/>
                                <p>点赞</p>
                            </div>
                            <div className={`searchList-operation-item`} onClick={() => this.handleMaterialOperation(item, 'see')}>
                                <SvgComponent className='icon-svg' type='icon-see'/>
                                <p>查看</p>
                            </div>
                            <div className={`searchList-operation-item`} onClick={() => this.handleMaterialOperation(item, 'download')}>
                                <SvgComponent className='icon-svg' type='icon-download'/>
                                <p>下载</p>
                            </div>
                        </div>
                    </div>;
        });
    }

    /** 
     * @func
     * @desc 构建筛选条件
     */
    public buildfilterNode = (currentSourceType: string, currentSourceFormat: string): React.ReactNode => {
        const { sourceType, sourceFormat } = this.config;

        return <>
            <div className='search-conditions-item'>
                {
                    sourceType.map((type: IDictionaryItem, index: number) => {
                        return <React.Fragment key={`type-${index}`}>
                            { index === 0 && <>
                                                <span>资源类型</span>
                                                <Divider type="vertical"/>
                                            </> 
                            }
                            { index !== 0 && <Divider type="vertical"/> }
                            <span  className={`${currentSourceType === type.value ? 'selected' : ''}`} onClick={() => this.handleSpanClick({ sourceType: type.value })}>{type.name}</span>
                        </React.Fragment>
                    })
                }
            </div>
            <div className='search-conditions-item'>
                {
                    sourceFormat.map((type: IDictionaryItem, index: number) => {
                        return <React.Fragment key={`format-${index}`}>
                            { index === 0 && <>
                                                <span>资源格式</span>
                                                <Divider type="vertical"/>
                                            </> 
                            }
                            { index !== 0 && <Divider type="vertical"/> }
                            <span className={`${currentSourceFormat === type.value ? 'selected' : ''}`} onClick={() => this.handleSpanClick({ sourceFormat: type.value })}>{type.name}</span>
                        </React.Fragment>
                    })
                }
            </div>
        </>
    }

    public handleModalOk = () => {
        this.setState({
            modalVisible: false
        });
    }

    public handleModalCancel = () => {
        this.setState({
            modalVisible: false
        });
    }

    public render() {
        const { searchSourceType, searchSourceFormat, dataSource, isLoading, hasData, modalVisible, currentViewSource, pageInfo } = this.state;
        const pageComponentProps: IPageComponnetProps = {
            ...this.state.pageInfo,
            pageChange: this.pageChange
        };
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

        return (
            <div className='search-result-container animateCss'>
                {/* <div className='search-control-box'>
                    <Search className='search-control' placeholder='搜索教材资源' onSearch={this.searchBook}/>
                </div> */}
                <div className='search-conditions'>
                    { this.buildfilterNode(searchSourceType, searchSourceFormat) }
                </div>
                <div className='search-result-content'>
                    {
                        isLoading ? <>
                            <Skeleton active/>
                            <Skeleton active/>
                            <Skeleton active/>
                        </> : <>
                            <Tag className='source-result-tag' color='red'>共找到{pageInfo.totalCount}个结果</Tag>
                            <div className='content-items-box'>
                                { this.buildResultItems() }
                            </div>
                            {
                                dataSource.length > 0 && <div className='source-result-pagination'>
                                    <PageComponent {...pageComponentProps}/>
                                </div>
                            }
                        </>
                    }
                    { modalVisible && <BrowseFileModalComponent {...browseFileModalProps}/> }
                    {
                        !isLoading && !hasData && <div className='no-data'>
                            <img alt='无数据' src={noData} />
                            <p>抱歉！没有找到相关资源，请更换关键词再试。</p>
                        </div>
                    }
                </div>
            </div>
        )
    }

    public componentWillUnmount() {
        bookSearchEventEmitter.removeAllListener(EventEmitterList.SEARCHCOURSEEVENT);
    }
}

function mapStateToProps(state: any) {
    return {
        searchBook: state.globalReducer.bookName
    };
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultContainer);
