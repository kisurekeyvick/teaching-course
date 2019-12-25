import * as React from 'react';
import { IRecommendProps } from '../interface';
import { books } from './index.config';
import { Icon, Button, Popover, Carousel } from 'antd';
import QrcodeComponent from 'components/qrcode/index';
import './index.scss';

export default class RecommendContainer extends React.PureComponent<IRecommendProps, any> {
    public carouselRef: any;

    constructor(public props: IRecommendProps) {
        super(props);

        this.state = {
            books: []
        };

        this.carouselRef = React.createRef();
    }

    componentDidMount() {
        this.loadRecommendBook();
    }

    /** 
     * @func
     * @desc 加载特别推荐
     */
    public loadRecommendBook = () => {
        this.setState({
            books: [...books]
        });
    }

    /** 
     * @func
     * @desc 下载教材
     */
    public download = () => {

    }

    /** 
     * @func
     * @desc 翻页
     */
    public turnPage = (direction: string) => {
        if (direction === 'prev') {
            this.carouselRef.current.slick.slickPrev();
        } else {
            this.carouselRef.current.slick.slickNext();
        }
    }

    public render() {
        const carouselProps = {
            speed: 1000,
            dots: false,
            autoplay: true
        };

        return <div className='recommend-box'>
                    <div className='recommend-title'>
                        <Icon className='icon-bell' type="bell" />
                        <p>通知中心</p>
                        <span>
                            <Icon className='icon icon-left' type="left" onClick={() => this.turnPage('prev')}/>
                            <Icon className='icon icon-right' type="right" onClick={() => this.turnPage('next')}/>
                        </span>
                    </div>

                    <div className='recommend-carousel-box'>
                        <Carousel {...carouselProps} ref={this.carouselRef}>
                            {
                                this.state.books.map((book: any) => {
                                    return <div className='recommend-carousel-item' key={book.key}>
                                        <div className='recommend-content'>
                                            <div className='recommend-content-title'>
                                                { book.type === 'zip' && <Icon type="file-zip" /> }
                                                { book.type === 'ppt' && <Icon type="file-ppt" /> }
                                                { book.type === 'doc' && <Icon type="file-word" /> }
                                                <span>{ book.title }</span>
                                            </div>
                                            <p className='recommend-content-desc'>{ book.desc }</p>
                                            <p>时间：{ book.time }</p>
                                            <p>大小：{ book.size }</p>
                                            <p>评分：{ book.rate }  下载量：{ book.downloadCount }</p>
                                        </div>
                                        <div className='recommend-operate'>
                                            <Button className='download-btn' type="primary" icon="download" size={'small'} onClick={this.download}>下载</Button>
                                            
                                            <Popover title='' content={ <QrcodeComponent url={book.qrcode}/> } trigger="click">
                                                <Icon className='recommend-operate-qrcode-icon' type="qrcode"/>
                                            </Popover>
                                        </div>
                                    </div>
                                })
                            }
                        </Carousel>
                    </div>
                </div>
    }
}
