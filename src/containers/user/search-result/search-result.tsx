import * as React from 'react';
import {connect} from 'react-redux';
import { Divider, Skeleton, Tag, Row, Col } from 'antd';
import { IDataSource, IConfig } from './search-result.config';
import { PageComponent, IPageComponnetProps, IPageInfo } from 'components/pagination/index';
import { api } from 'common/api/index';
import { EventEmitterList, globalEventEmitter } from 'common/utils/eventEmitter/list';
import './search-result.scss';

interface ISearchResultProps {
    [key: string]: any;
}

interface IState {
    searchType: string;
    dataSource: IDataSource[];
    hasData: boolean;
    isLoading: boolean;
    pageInfo: IPageInfo;
}

class SearchResultContainer extends React.PureComponent<ISearchResultProps, IState> {
    public config: IConfig;

    constructor(public props: ISearchResultProps) {
        super(props);

        this.state = {
            searchType: 'all',
            dataSource: [],
            hasData: false,
            isLoading: false,
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
            searchBookHistory: ''
        };
    }

    public componentDidMount() {
        this.loadSearchResult();
        const self = this;
        globalEventEmitter.on(EventEmitterList.SEARCHCOURSEEVENT, function(...res: any[]) {
            if (res[0].searchBook !== self.config.searchBookHistory) {
                self.config.searchBookHistory = res[0].searchBook;
                self.loadSearchResult();
            }
        });
    }

    /** 
     * @func
     * @desc 加载修改结果
     */
    public loadSearchResult = (params = {}) => {
        this.setState({
            isLoading: true
        });

        api.loadSearchResult(params).then((res: any) => {
            if (res.status === 200) {
                const dataSource = res.data.map((item: IDataSource) => {
                    item.userImg = 'https://mirror-gold-cdn.xitu.io/1693d70320728da3b28?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1';
                    return item;
                });

                this.setState({
                    dataSource,
                    hasData: dataSource.length > 0,
                    isLoading: false
                });
            }
        });
    }

    /** 
     * @func
     * @desc 时间的搜索
     */
    public handleSpanClick = (type: string) => {
        if (this.state.searchType !== type) {
            this.setState({
                searchType: type
            });

            this.loadSearchResult();
        }
    }

    /** 
     * @callback
     * @desc 点击进入教材详情
     */
    public handResultItemClick = (source: IDataSource) => {
        const { history } = this.props;
        const url: string = `/book/id/${source.id}`;
        history.push(url);
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
     * @desc 构建搜索结果项
     */
    public buildResultItems = (): React.ReactNode => {
        return this.state.dataSource.map((item: IDataSource) => {
            return <div key={item.id} className='content-item' onClick={() => this.handResultItemClick(item)}>
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
                    </div>;
        });
    }

    public render() {
        const { searchType, dataSource, isLoading } = this.state;
        const pageComponentProps: IPageComponnetProps = {
            ...this.state.pageInfo,
            pageChange: this.pageChange
        };

        return (
            <div className='search-result-container animateCss'>
                <div className='search-conditions'>
                    <span className={`${searchType === 'all' ? 'selected' : ''}`} onClick={() => this.handleSpanClick('all')}>全部</span>
                    <Divider type="vertical"/>
                    <span className={`${searchType === 'day' ? 'selected' : ''}`} onClick={() => this.handleSpanClick('day')}>一天内</span>
                    <Divider type="vertical"/>
                    <span className={`${searchType === 'week' ? 'selected' : ''}`} onClick={() => this.handleSpanClick('week')}>一周内</span>
                    <Divider type="vertical"/>
                    <span className={`${searchType === 'month' ? 'selected' : ''}`} onClick={() => this.handleSpanClick('month')}>三月内</span>
                </div>
                <div className='search-result-content'>
                    <Skeleton active loading={isLoading} paragraph={{ rows: 10 }}>
                        <Tag className='source-result-tag' color="blue">共找到{dataSource.length}个结果</Tag>
                        <div className='content-items-box'>
                            { this.buildResultItems() }
                        </div>
                        {
                            dataSource.length > 0 && <div className='source-result-pagination'>
                                <PageComponent {...pageComponentProps}/>
                            </div>
                        }
                    </Skeleton>
                </div>
            </div>
        )
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
