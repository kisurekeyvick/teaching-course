import * as React from 'react';
import Directory from './directory/index';
// import Recommend from './recommend/index';
// import LatestUpload from './latestUpload/index';
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
        const { history } = this.props;

        const directoryProps: IDirectoryProps = {
            callBack: this.selectDirectoryMenu,
            history
        };

        const bookListProps = {
            history
        };

        // const latestUploadProps = {
        //     history
        // };

        return <div className='book-container'>
                    <div className='book-body'>
                        <div className='book-left lefeAnimate'>
                            <Directory {...directoryProps}/>
                        </div>
                        <div className='book-center centerAnimate'>
                            <BookList {...bookListProps}/>
                        </div>
                        {/* <div className='book-right rightAnimate'>
                            <div className='book-right-recommend'>
                                <Recommend />
                            </div>
                            <div className='book-right-latestUpload'>
                                <LatestUpload {...latestUploadProps}/>
                            </div>
                        </div> */}
                    </div>
                </div>
    }
}