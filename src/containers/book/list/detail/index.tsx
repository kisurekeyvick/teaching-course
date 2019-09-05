import * as React from 'react';
import './index.scss';
import { IBookListItemDetailProps } from '../../interface';

export default class BookListItemDetailContainer extends React.PureComponent<IBookListItemDetailProps, any> {
    constructor(public props: IBookListItemDetailProps) {
        super(props);
    }

    public render() {
        return <div>123</div>
    }
}