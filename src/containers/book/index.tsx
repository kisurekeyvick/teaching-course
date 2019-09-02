import * as React from 'react';
import Directory from './directory/index';
import Recommend from './recommend/index';
import LatestUpload from './latestUpload/index';
import BookList from './list/index';
import { IDirectoryProps } from './interface';
import './index.scss';

interface IProps {
    match?: any
    history?: any;
    [key: string]: any;
}

export default class BookContainer extends React.Component<IProps, any> {
    constructor(public props: IProps) {
        super(props);
    }

    /** 
     * @func
     * @desc 选择教材目录
     */
    public selectDirectoryMenu = () => {

    }

    public render() {
        const directoryProps: IDirectoryProps = {
            callBack: this.selectDirectoryMenu
        };

        console.log('内部的props', this.props);

        return <div className='book-container'>
                    <div className='book-body'>
                        <div className='book-left'>
                            <Directory {...directoryProps}/>
                        </div>
                        <div className='book-center'>
                            <BookList />
                        </div>
                        <div className='book-right'>
                            <div className='book-right-recommend'>
                                <Recommend />
                            </div>
                            <div className='book-right-latestUpload'>
                                <LatestUpload />
                            </div>
                        </div>
                    </div>
                </div>
    }
}