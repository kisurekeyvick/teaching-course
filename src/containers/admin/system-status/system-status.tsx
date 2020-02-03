import React from 'react';
import { Table } from 'antd';
import { IDataSource, dataSource, columns } from './system-status.config';
import './system-status.scss';

interface ISystemStatusProps {
    [key: string]: any;
}

interface IState {
    dataSource: IDataSource[];
    [key: string]: any;
}

export default class SystemStatusContainer extends React.PureComponent<ISystemStatusProps, IState> {
    constructor(public props: ISystemStatusProps) {
        super(props);

        this.state = {
            dataSource
        };
    }

    public render() {
        const { dataSource } = this.state;

        return (
            <div className='system-status-container animateCss'>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}>
                </Table>
            </div>
        )
    }
}
