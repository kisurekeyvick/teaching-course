import * as React from 'react';
import {connect} from 'react-redux';
import { filterConfig, IFilterConfigItem } from './index.config';
import { Divider, Radio, Icon } from 'antd';
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
            filterConfig: _.cloneDeep(filterConfig)
        };
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
                    {
                        this.props.searchBook
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
