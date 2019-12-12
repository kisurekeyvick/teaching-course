import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem, imgList } from './index.config';
import { Divider, Radio, Icon, Rate, Popover, Skeleton, message } from 'antd';
import { PageComponent, IPageComponnetProps, IPageInfo } from 'components/pagination/index';
import QrcodeComponent from 'components/qrcode/index';
import { cloneDeep } from 'lodash';
import './index.scss';
import { IBookListProps } from '../interface';
import { SvgComponent } from 'components/icon/icon';
import { api } from 'common/api/index';

interface IState {
    format: string;
    filterConfig: any;
    booklist: any[];
    pageInfo: IPageInfo;
    hasData: boolean;
    isLoading: boolean;
}

class BookListContainer extends React.PureComponent<IBookListProps, IState> {
    constructor(public props: IBookListProps) {
        super(props);

        this.state = {
            /** 资源格式 */
            format: '',
            /** 搜索条件 */
            filterConfig: cloneDeep(filterConfig),
            /** 教材列表 */
            booklist: [],
            /** 分页 */
            pageInfo: {
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                rowCount: 0,
                totalCount: 0,
                pageSizeOptions:['10', '20', '30', '40', '50']
            },
            hasData: false,
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadBookList();
    }

    /** 
     * @func
     * @desc 加载book列表
     */
    public loadBookList = () => {
        message.loading('加载数据中', 2);

        this.setState({
            isLoading: true
        });

        api.loadBookList().then((res: any) => {
            if (res.status === 200) {
                const booklist = res.data;

                this.setState({
                    booklist,
                    hasData: booklist.length > 0,
                    isLoading: false
                });

                message.info('加载完成');
            }
        });
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
     * @desc 选择教材
     */
    public selectBook = (item: any) => {
        const { history } = this.props;
        const url: string = `/book/id/${item.id}`;
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

    public render() {
        const pageComponentProps: IPageComponnetProps = {
            ...this.state.pageInfo,
            pageChange: this.pageChange
        };

        const { format, booklist, hasData, isLoading } = this.state;

        return <div className='book-list'>
                    <div className='filter-box'>
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
                            </div> : hasData ? booklist.map((item: any) => {
                                return <div className='booklist-item' key={item.id} onClick={() => this.selectBook(item)}>
                                            <div className='booklist-item-top'>
                                                <div className='booklist-item-top-left'>
                                                    <span>{ item.title }</span>
                                                    {/* <Icon className='icon-like' type="heart" /> */}
                                                    <SvgComponent className='lover-svg' type='icon-love' />
                                                </div>
                                                <div className='booklist-item-top-right'>
                                                    <Rate disabled defaultValue={item.rate}/>
                                                    <i className='i-rate'>{item.rate}</i>
                                                    <label>({item.currentCount})</label>
                                                    <Popover title='' content={ <QrcodeComponent url={item.qrcode}/> } trigger="hover">
                                                        <Icon className='booklist-item-top-right-qrcode' type="qrcode"/>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className='booklist-item-bottom'>
                                                <img alt='缩略图' src={item.pic} />
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
                                        </div>
                            }) :
                            <div className='noData'>
                                <img alt='无数据' src={imgList.noData} />
                                <p>很抱歉没有符合条件的教材</p>
                            </div>
                        }
                    </div>
                    {
                        booklist.length > 0 && <div className='booklist-pagination'>
                            <PageComponent {...pageComponentProps}/>
                        </div>
                    }
                </div>
    }
}

function mapStateToProps(state: any) {
    return {
        searchBook: state.globalReducer.bookName
    }
}

export default connect(
    mapStateToProps
)(BookListContainer);
