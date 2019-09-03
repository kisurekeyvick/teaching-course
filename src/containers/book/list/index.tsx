import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem, booklist, imgList } from './index.config';
import { Divider, Radio, Icon, Rate, Popover } from 'antd';
import { PageComponent, IPageComponnetProps } from 'components/pagination/index';
import QrcodeComponent from 'components/qrcode/index';
import * as _ from 'lodash';
import './index.scss';

interface IProps {
    searchBook: string;
    [key: string]: any;
}

class BookListContainer extends React.PureComponent<IProps, any> {
    constructor(public props: IProps) {
        super(props);

        this.state = {
            /** 资源格式 */
            format: '',
            /** 搜索条件 */
            filterConfig: _.cloneDeep(filterConfig),
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
            }
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
        this.setState({
            booklist: booklist
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
    public selectBook = (e: any) => {
        console.log(e);
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

        return <div className='book-list'>
                    <div className='filter-box'>
                        <div className='filter-box-type'>
                            { this.buildfilterContent({ sourceKey: 'type', componentType: 'common'}) }
                        </div>
                        <div className='filter-box-format'>
                            <label>资源格式：</label>
                            { this.buildfilterContent({ sourceKey: 'format', componentType: 'radio', state: this.state.format }) }
                        </div>
                        <div className='filter-box-sort'>
                            <label>排序：</label>
                            { this.buildfilterContent({ sourceKey: 'sort', componentType: 'common'}) }
                        </div>
                    </div>

                    <div className='booklist-container'>
                        {
                            this.state.booklist.length > 0 ? this.state.booklist.map((item: any) => {
                                return <div className='booklist-item' key={item.id} onClick={this.selectBook}>
                                            <div className='booklist-item-top'>
                                                <div className='booklist-item-top-left'>
                                                    { item.type === 'zip' && <Icon type="file-zip" /> }
                                                    { item.type === 'ppt' && <Icon type="file-ppt" /> }
                                                    { item.type === 'doc' && <Icon type="file-word" /> }
                                                    <span>{ item.title }</span>
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
                        this.state.booklist.length > 0 && <div className='booklist-pagination'>
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
