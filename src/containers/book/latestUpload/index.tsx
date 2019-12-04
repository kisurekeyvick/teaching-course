import * as React from 'react';
import './index.scss';
import { ILatestUploadProps } from '../interface';
import { list, imgList } from './index.config';
import { Icon } from 'antd';
import { SvgComponent } from 'components/icon/icon';

export default class LatestUploadContainer extends React.PureComponent<ILatestUploadProps, any> {
    constructor(public props: ILatestUploadProps) {
        super(props);

        this.state = {
            list: []
        };
    }

    componentDidMount() {
        this.loadLatestUploadList();
    }

    /** 
     * @func
     * @desc 加载最新上传列表
     */
    public loadLatestUploadList = () => {
        this.setState({
            list: [...list]
        });
    }

    /** 
     * @func
     * @desc 查看book详情
     */
    public showBookDetail = (book: any) => {
        const { history } = this.props;
        const url: string = `/book/id/${book.id}`;
        history.push(url);
    }

    public render() {
        return <div className='latestUpload-box'>
                    <div className='latestUpload-title'>
                        <SvgComponent className='upload-svg' type='icon-upload' />
                        <p>最新上传</p>
                    </div>
                    <div className='latestUpload-list'>
                        {
                            this.state.list.length === 0 ?
                            <div className='noData'>
                                <img alt='noData' src={imgList.noData}/>
                            </div> :
                            this.state.list.map((item: any) => {
                                return <div className='latestUpload-list-item' key={item.id} onClick={() => this.showBookDetail(item)}>
                                            <div className='list-item-top'>
                                                { item.type === 'doc' && <Icon className='list-item-icon' type="file-word" /> }
                                                { item.type === 'pic' && <Icon className='list-item-icon' type="picture" />}
                                                <span>{item.title}</span>
                                            </div>
                                            <div className='list-item-bottom'>
                                                <p>{item.contributors} 上传于{item.time}</p>
                                            </div>
                                        </div>
                            })
                        }
                    </div>
                </div>
    }
}
