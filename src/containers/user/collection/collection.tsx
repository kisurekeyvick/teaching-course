import React from 'react';
import { Skeleton, Row, Col, Popconfirm, message } from 'antd';
import { api } from 'common/api/index';
import { IDataSource } from './collection.config';
import noDataImg from 'assets/images/noData.png';
import { SvgComponent } from 'components/icon/icon';
import './collection.scss';

interface IColleactionProps {
    [key: string]: any;
}

interface IState {
    dataSource: IDataSource[];
    isLoading: boolean;
    hasData: boolean;
    canScrollLoad: boolean;
    [key: string]: any;
}

export default class ColleactionContainer extends React.PureComponent<IColleactionProps, IState> {
    constructor(public props: IColleactionProps) {
        super(props);

        this.state = {
            dataSource: [],
            isLoading: false,
            hasData: false,
            canScrollLoad: false
        };
    }

    public componentDidMount() {
        this.loadColleaction();
    }

    public loadColleaction = (params = {}) => {
        message.loading('加载数据中', 2);

        this.setState({
            isLoading: true
        });

        api.loadCollectionResult(params).then((res: any) => {
            if (res.status === 200) {
                const dataSource = res.data;

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
     * @callback
     * @desc  取消收藏
     */
    public cancelCollection = (source: IDataSource) => {
        message.success('完成取消收藏');
    }

    /** 
     * @callback
     * @desc 下载收藏
     */
    public downloadCollection = (source: IDataSource) => {
        message.success('完成下载');
    }

    public render() {
        const { hasData, dataSource = [], isLoading } = this.state;

        return (
            <div className='colleaction-container animateCss'>
                {
                    isLoading ?  <>
                        <Skeleton active/>
                        <Skeleton active/>
                        <Skeleton active/>
                    </> : hasData ? <div>
                        <Row gutter={24}>
                            {
                                dataSource.map((source: IDataSource) => {
                                    return <Col xs={{span: 12}} sm={{span: 8}} lg={{span: 6}}>
                                                <div className='collection-item' key={source.id}>
                                                    <div className='collection-item-top'>
                                                        <Row>
                                                            <Col>
                                                                <label>{source.title}</label>
                                                            </Col>
                                                            <Col>
                                                                {/* <img src={source.typeImg}/> */}
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
                                                                <Popconfirm title='请确认取消收藏。' onConfirm={() => this.cancelCollection(source)} okText='确认' cancelText='取消'>
                                                                    <SvgComponent className='svg-component' type='icon-love_fill' />
                                                                </Popconfirm>
                                                                
                                                                <span className='download-btn' onClick={() => this.downloadCollection(source)}>下载</span>
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
            </div>
        )
    }
}
