import React from 'react';
import { Skeleton, Row, Col, Popconfirm, message, Icon } from 'antd';
import { IDataSource } from './collection.config';
import noDataImg from 'assets/images/noData.png';
import { SvgComponent } from 'components/icon/icon';
import { api } from 'common/api/index';
import { ICollectionListsRequest, ICollectionListsResponse, ITeachChapterResList } from 'common/api/api-interface';
import { IPageInfo } from 'components/pagination/index';
import { messageFunc } from 'common/utils/function';
import { sourceFormat, matchFieldFindeTarget, IDictionaryItem } from 'common/dictionary/index';
import './collection.scss';

interface IColleactionProps {
    [key: string]: any;
}

interface IState {
    dataSource: IDataSource[];
    isLoading: boolean;
    hasData: boolean;
    canScrollLoad: boolean;
    pageInfo: IPageInfo;
    [key: string]: any;
}

export default class ColleactionContainer extends React.PureComponent<IColleactionProps, IState> {
    constructor(public props: IColleactionProps) {
        super(props);

        this.state = {
            dataSource: [],
            isLoading: true,
            hasData: false,
            canScrollLoad: true,
            pageInfo: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                rowCount: 0,
                totalCount: 0,
                pageSizeOptions:['10', '20', '30', '40', '50']
            }
        };
    }

    public componentDidMount() {
        const params: ICollectionListsRequest = {
            pageInfo: {
                pageSize: 10,
                pageNum: 1
            }
        };

        this.loadColleaction(params);
    }

    public loadColleaction = (params: ICollectionListsRequest) => {
        const loading = messageFunc();

        this.setState({
            isLoading: true
        });

        api.collectionList(params).then((res: ICollectionListsResponse) => {
            let state = {};

            if (res.status === 200 && res.data.success) {
                const { hasNextPage, list } = res.data.result.teachChapterList;
                const dataSource: IDataSource[] = list.map((item: ITeachChapterResList) => {
                    const typeImg: IDictionaryItem = matchFieldFindeTarget(sourceFormat, { value: String(item.fileFormat) })!;

                    return {
                        size: item.size,
                        title: item.name,
                        desc: item.desc,
                        url: item.link,
                        type: item.fileType,
                        typeImg: typeImg.src,
                        id: item.id
                    };
                });

                state = {
                    dataSource,
                    hasData: dataSource.length > 0,
                    canScrollLoad: hasNextPage
                };

                loading.success('加载完成');
            } else {
                state = {
                    dataSource: [],
                    hasData: false,
                    canScrollLoad: false
                };

                loading.error(res.data.desc);
            }

            this.setState({
                ...state,
                isLoading: false
            });
        });
    }

    /** 
     * @callback
     * @desc  取消收藏
     */
    public cancelCollection = (source: IDataSource) => {
        message.success('已取消收藏');
    }

    /** 
     * @callback
     * @desc 下载收藏
     */
    public downloadCollection = (source: IDataSource) => {
        message.success('完成下载');
    }

    /** 
     * @func
     * @desc 构建骨架屏
     */
    public buildSkeleton = (num: number = 3): React.ReactNode => {
        return <Row className='skeleton-box' gutter={24}>
            {
                Array.apply(null, Array(num)).map((x, i: number) => {
                    return <Col className='skeleton-col' key={`skeleton-col-${i}`} xs={{span: 12}} sm={{span: 8}} lg={{span: 6}}>
                                <Skeleton active/>
                            </Col>
                })
            }
        </Row>
    }

    public render() {
        const { hasData, dataSource = [], isLoading, canScrollLoad } = this.state;
        const skeleton: React.ReactNode = this.buildSkeleton();

        return (
            <div className='colleaction-container animateCss'>
                {
                    isLoading ? skeleton : hasData ? <div>
                        <Row gutter={24}>
                            {
                                dataSource.map((source: IDataSource, index: number) => {
                                    return <Col xs={{span: 12}} sm={{span: 8}} lg={{span: 6}}>
                                                <div className='collection-item' key={`${source.id}-${index}`}>
                                                    <div className='collection-item-top'>
                                                        <Row>
                                                            <Col>
                                                                <label>{source.title}</label>
                                                            </Col>
                                                            <Col>
                                                                <img alt='file-format-logo' className='file-format-logo' src={source.typeImg}/>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <p className='describle'>{source.desc}</p>
                                                    <div className='collection-item-bottom'>
                                                        <Row>
                                                            <Col span={12}>
                                                                <label>文件大小：{source.size}</label>
                                                            </Col>
                                                            <Col className='bottom-right' span={12}>
                                                                <span className='download-btn' onClick={() => this.downloadCollection(source)}><Icon type="cloud-download" /></span>
                                                                <Popconfirm title='请确认取消收藏。' onConfirm={() => this.cancelCollection(source)} okText='确认' cancelText='取消'>
                                                                    <span><SvgComponent className='svg-component' type='icon-love_fill' /></span>
                                                                </Popconfirm>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>
                                })
                            }
                        </Row>
                    </div> : 
                    <div className='no-data'>
                        <img alt='无数据' src={noDataImg} />
                        <p>您暂时没有搜藏记录，赶快搜索课程资源，选择您喜欢的课程并收藏吧！</p>
                    </div>
                }
                <div className='colleaction-bottom'>
                    { canScrollLoad && <p className='can-load-more'>加载更多...</p> }
                    { hasData && !canScrollLoad && <p className='can-not-load'>— — — — — — 我是有底线的 — — — — — —</p> }
                </div>
            </div>
        )
    }
}
