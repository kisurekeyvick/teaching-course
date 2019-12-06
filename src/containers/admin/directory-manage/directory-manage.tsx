import * as React from 'react';
import './directory-manage.scss';

interface IBirectoryManageProps {
    [key: string]: any;
}

interface IState {
    [key: string]: any;
}

export class BirectoryManageContainer extends React.Component<IBirectoryManageProps, IState> {
    constructor(public props: IBirectoryManageProps) {
        super(props);
    }

    public render() {
        return <div>123</div>
    }
}
