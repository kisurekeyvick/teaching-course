import * as React from 'react';
import { IRecommendProps } from '../interface';
import { book } from './index.config';
import { Icon, Button, Popover } from 'antd';
import QrcodeComponent from 'components/qrcode/index';
import './index.scss';

export default class RecommendContainer extends React.PureComponent<IRecommendProps, any> {
    constructor(public props: IRecommendProps) {
        super(props);

        this.state = {
            book: {}
        };
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
            book: {...book}
        });
    }

    /** 
     * @func
     * @desc 下载教材
     */
    public download = () => {

    }

    public render() {
        const book = this.state.book;

        return <div className='recommend-box'>
                    <div className='recommend-title'>
                        <p>特别推荐</p>
                    </div>
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
    }
}
