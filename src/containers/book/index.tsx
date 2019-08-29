import * as React from 'react';
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

    public render() {
        return <div className='book'>
                    book page
                </div>
    }
}