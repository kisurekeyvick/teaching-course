import * as React from 'react';
import {connect} from 'react-redux';
import './index.scss';

interface IProps {
    searchBook: string;
    [key: string]: any;
}

class BookListContainer extends React.PureComponent<IProps, any> {
    constructor(public props: IProps) {
        super(props);
    }

    public render() {
        return <div className='book-list'>
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
