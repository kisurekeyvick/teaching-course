import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem, imgList } from './index.config';
import { Divider, Radio, Icon, Rate, Skeleton, message, Breadcrumb } from 'antd';
import { PageComponent, IPageComponnetProps, IPageInfo } from 'components/pagination/index';
import { cloneDeep } from 'lodash';
import { IBookListProps } from '../interface';
import { SvgComponent } from 'components/icon/icon';
import dayjs from 'dayjs';
import { defaultBookPic } from 'common/service/img-collection';
import { dictionary, IDictionaryItem } from 'common/dictionary/index';
import { downloadFile } from 'common/utils/function';
import { ITeachChapterList } from 'common/api/api-interface';
import { handleMaterialOperation, IPromiseResolve } from 'common/service/material-operation-ajax';
import './index.scss';

interface IState {
    format: string;
    filterConfig: any;
    booklist: ITeachChapterList[];
    pageInfo: IPageInfo;
    breadcrumb: string[];
    hasData: boolean;
    isLoading: boolean;
    updateTime: number
}

interface IConifg {
    maxScore: number;
    // teacherCache: any;
    materialOperation: IDictionaryItem[]
}

class BookListContainer extends React.PureComponent<IBookListProps, IState> {
    public config: IConifg;

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
            breadcrumb: [],
            hasData: false,
            isLoading: false,
            updateTime: 0
        };

        this.config = {
            maxScore: 10,
            // teacherCache: getUserBaseInfo(),
            materialOperation: dictionary.get('material-operation')!
        };
    }

    componentDidMount() {
    }

    static getDerivedStateFromProps(nextProps: IBookListProps, prevState: IState) {
        if (nextProps.showList && nextProps.updateTime > prevState.updateTime) {
            const result: ITeachChapterList[] = nextProps.showList.map((item: any) => {
                item.createTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
                item.title = item.name;
                item.pic = item.pic || defaultBookPic;
                return {    
                    ...item
                }
            });

            return {
                breadcrumb: nextProps.breadcrumb,
                booklist: result,
                hasData: result.length > 0,
                isLoading: nextProps.isLoading === 'true' ? true : false
            }
        }

        return null;
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
     * @desc 收藏 点赞
     */
    public handleMaterialOperation = (item: ITeachChapterList, typeStr: string) => {
        handleMaterialOperation({ operation: typeStr, sourceItem: item }).then(({ bool, desc }: IPromiseResolve) => {
            if (bool) {
                let { booklist } = this.state;
                booklist = booklist.map((book: ITeachChapterList) => {
                    if (item.chapterId === book.chapterId) {
                        typeStr === 'praise' && (book.isPraise = !book.isPraise);
                        typeStr === 'collect' && (book.isCollect = !book.isCollect);
                    }
                    
                    return book;
                });

                this.setState({
                    booklist: cloneDeep(booklist),
                    updateTime: Date.now()
                });

                message.success(desc);
            } else {
                message.error(desc);
            }
        });
    }

    /** 
     * @func
     * @desc 查看详情
     */
    public showDetail = (item: any) => {

    }

    /** 
     * @func
     * @desc 下载
     */
    public download = (item: ITeachChapterList) => {
        downloadFile({ fileName: item.name, fileFormat: item.fileFormat, url: item.link });
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

        const { format, booklist, hasData, isLoading, breadcrumb } = this.state;

        return <div className='book-list'>
                    <div className='filter-box'>
                        {
                            breadcrumb.length > 0 && <div className='breadcrumb-box'>
                                <SvgComponent className='svg-breadcrumb' type='icon-breadcrumb'/>
                                <Breadcrumb>
                                    {
                                        breadcrumb.map((item: string, index: number) => {
                                            return <Breadcrumb.Item key={`breadcrumb-${index}`}>{item}</Breadcrumb.Item>
                                        })
                                    }
                                </Breadcrumb>
                            </div>
                        }
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
                            </div> : hasData ? booklist.map((item: ITeachChapterList) => {
                                return <div className='booklist-item' key={item.id}>
                                            <div className='booklist-item-top'>
                                                <div className='booklist-item-top-left'>
                                                    <span>{ item.title }</span>
                                                </div>
                                                <div className='booklist-item-top-right'>
                                                    <Rate disabled defaultValue={item.rate}/>
                                                    <i className='i-rate'>{item.rate}</i>
                                                    <label>({item.currentCount})</label>
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
                                            <div className='booklist-operation'>
                                                <div className={`booklist-operation-item ${item.isCollect ? 'selected' : ''}`} onClick={() => this.handleMaterialOperation(item, 'collect')}>
                                                    <SvgComponent className='icon-svg' type='icon-collect'/>
                                                    <p>收藏</p>
                                                </div>
                                                <div className={`booklist-operation-item ${item.isPraise ? 'selected' : ''}`} onClick={() => this.handleMaterialOperation(item, 'praise')}>
                                                    <SvgComponent className='icon-svg' type='icon-praise'/>
                                                    <p>点赞</p>
                                                </div>
                                                <div className={`booklist-operation-item`} onClick={() => this.handleMaterialOperation(item, 'see')}>
                                                    <SvgComponent className='icon-svg' type='icon-see'/>
                                                    <p>查看</p>
                                                </div>
                                                <div className={`booklist-operation-item`} onClick={() => this.download(item)}>
                                                    <SvgComponent className='icon-svg' type='icon-download'/>
                                                    <p>下载</p>
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
    const { showList = [], isLoading, breadcrumb = [], updateTime } = state.chapterMaterial.chaperMaterial;

    return {
        breadcrumb,
        showList,
        isLoading,
        updateTime
    }
}

export default connect(
    mapStateToProps
)(BookListContainer);
