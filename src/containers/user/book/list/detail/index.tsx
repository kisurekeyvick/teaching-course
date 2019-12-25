import * as React from 'react';
import './index.scss';
import { Breadcrumb, Icon, BackTop, Card, Divider, Modal } from 'antd';
import { Link } from "react-router-dom";
import { PageComponent, IPageComponnetProps } from 'components/pagination/index';
import { AudioComponent, IAudioComponentProps } from 'components/audio/index';
import { IBookListItemDetailProps } from '../../interface';
import noData from 'assets/images/noData.png';
import { bookDetail, ICard } from './index.config';

const { Meta } = Card;

export default class BookListItemDetailContainer extends React.PureComponent<IBookListItemDetailProps, any> {
    constructor(public props: IBookListItemDetailProps) {
        super(props);

        this.state = {
            /** 教材详情数据 */
            bookDetail: {
                userInfo: {},
                currentBookInfo: {},
                content: []
            },
            /** 分页 */
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

    componentDidMount() {
        this.loadBookDetail();
    }

    /** 
     * @func
     * @desc 加载教材详情
     */
    public loadBookDetail = () => {
        const detail = {...bookDetail};
        this.setState({
            bookDetail: detail
        });
    }

    /** 
     * @func
     * @desc 查看该作者
     */
    public viewAuthor = () => {

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
     * @desc 下载单个文件
     */
    public downLoadItem = (item: ICard) => {

    }

    /** 
     * @func
     * @desc 查看单个文件
     */
    public seeItem = (item: ICard) => {
        if (item.type === 'audio') {
            const props: IAudioComponentProps = {
                resolveUrl: item.link
            };

            Modal.info({
                width: 625,
                icon: <Icon className='icon book-detail-icon-audio' type="audio" />,
                title: item.name,
                content: (
                  <div>
                    <AudioComponent {...props}/>
                  </div>
                ),
                okText: '关闭',
                onOk() {},
              });
        }
    }

    /** 
     * @func
     * @desc 构建卡片
     */
    public buildCard = (content: ICard[]): React.ReactNode => {
        return content.map((item: ICard) => {
            const description: React.ReactNode = <div className='description'>
                <p className='file-name'>{item.name}</p>
                <div>大小：{item.size} <Divider type='vertical' /> 格式：{item.type}</div>
                <p>上传时间：{item.time}</p>
            </div>

            let layout: React.ReactNode = <Card className='card-file-item' key={item.id}
                            actions={[
                                <Icon type="download" onClick={() => this.downLoadItem(item)}/>,
                                <Icon type="eye" onClick={() => this.seeItem(item)}/>
                            ]}>
                        <Meta description={description} />
                    </Card>

            return layout;
        });
    }

    public render() {
        const detail = this.state.bookDetail;

        const pageComponentProps: IPageComponnetProps = {
            ...this.state.pageInfo,
            pageChange: this.pageChange
        };

        return <div className='book-detail-container'>
                    <div className='book-detail-breadcrumb'>
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to='/book'>首页</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className='book-detail-content'>
                        <div className='content-left lefeAnimate'>
                            <ul>
                                <li className='li-like'><Icon className='icon like' type="like" /><span>{detail.currentBookInfo.praise}</span></li>
                                <li><Icon className='icon star' type="star" /></li>
                            </ul>
                        </div>
                        <div className='content-center centerAnimate'>
                            <div className='center-head'>
                                <img alt='贡献者头像' src={detail.userInfo.img} onClick={this.viewAuthor}/>
                                <div className='center-head-right'>
                                    <p className='book-title'>{detail.currentBookInfo.title}</p>
                                    <p>{detail.currentBookInfo.time} 阅读 {detail.currentBookInfo.readCount}</p>
                                </div>
                            </div>
                            <div className='content'>
                                {
                                    this.state.bookDetail.content.length === 0 ? 
                                    <div className='noData'>
                                        <img alt='无数据' src={noData} />
                                    </div> : 
                                    <div className='inner-content'>
                                        { this.buildCard(this.state.bookDetail.content) }
                                    </div>
                                }
                            </div>
                            {
                                this.state.bookDetail.content.length > 0 && <div className='bookDetail-pagination'>
                                    <PageComponent {...pageComponentProps}/>
                                </div>
                            }
                        </div>
                        <div className='content-right rightAnimate'>
                            <div className='inner'>
                                <p className='title'>关于贡献者</p>
                                <div className='content-right-detail'>
                                    <div className='content-right-detail-top'>
                                        <img alt='贡献者头像' src={detail.userInfo.img} onClick={this.viewAuthor}/>
                                        <p>{detail.userInfo.job}</p>
                                    </div>
                                    <div className='content-right-detail-bottom'>
                                        <p><Icon className='icon like' type="like" /><span>获得总点赞 {detail.userInfo.praise}</span></p>
                                        <p><Icon className='icon eye' type="eye" /><span>教材被阅读 {detail.userInfo.readCount}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BackTop className='back-top'>
                        <Icon type="caret-up" />
                    </BackTop>
                </div>
    }
}
