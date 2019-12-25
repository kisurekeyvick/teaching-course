import * as React from 'react';
import { Pagination } from 'antd';
import './index.scss';

export interface IPageInfo {
    currentPage: number;
    pageCount: number;
    pageSize: number;
    rowCount: number;
    totalCount: number;
    pageSizeOptions?: string[];
}

export interface IPageComponnetProps {
    pageChange: Function;
    totalCount: number;
    currentPage: number;
    pageSize: number;
    defaultCurrent?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    pageSizeOptions?: any[];
    showPageInfo?: boolean;
    size?: string;
}

export const defaultPageInfo: IPageInfo = {
    currentPage: 1,
    pageCount: 0,
    pageSize: 10,
    rowCount: 0,
    totalCount: 0,
    pageSizeOptions:['10', '20', '30', '40', '50']
};

export class PageComponent extends React.PureComponent<IPageComponnetProps, any> {
    static defaultProps = {
        defaultCurrent: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showPageInfo: true,
        size: ''
    };
    
    constructor(public props: IPageComponnetProps) {
        super(props);
    }

    /**
     * 点击分页控件触发回调给父级
     * @param page 当前页
     * @param pageSize 当前页数量
     */
    public pageChange = (page: number, pageSize?: number) => {
        this.props.pageChange(page, pageSize);
    }

    public render() {
        const multiply = (num?: number) => (this.props.currentPage-(num ? num : 0))*(this.props.pageSize) + (num ? num : 0);
        const start: number = this.props.totalCount === 0 ? 0 : multiply(1);
        const end: number = multiply() > this.props.totalCount ? this.props.totalCount : multiply();

        return (
            <div className='page-component-box'>
                {
                    this.props.showPageInfo ? <span className='page-component-pageInfo'>【第{start}-{end} 条，共{this.props.totalCount}条】</span> : ''
                }
                <Pagination
                    showSizeChanger={this.props.showSizeChanger} 
                    showQuickJumper={this.props.showQuickJumper}
                    total={this.props.totalCount} 
                    defaultCurrent={this.props.currentPage}
                    pageSize={this.props.pageSize} 
                    pageSizeOptions={this.props.pageSizeOptions}
                    onChange={this.pageChange}
                    onShowSizeChange={this.pageChange}
                    size={this.props.size}/>
            </div>
        );
    }
}
