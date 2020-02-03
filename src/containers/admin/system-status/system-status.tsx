import React from 'react';
import { SvgComponent } from 'components/icon/icon';
import { Row, Col, Table } from 'antd';
import { IDataSource, dataSource } from './system-status.config';
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
        // const speak: string = '正在拼命开发中，敬请期待！';
        // const strArr: string[] = speak.split('');
        const { dataSource } = this.state;

        return (
            <div className='system-status-container animateCss'>
                <Table
                    columns={[]}
                     dataSource={dataSource}
                     pagination={false}>
                </Table>
                {/* <div className='svg-container'>
                    <Row gutter={48}>
                        <Col xs={24} sm={8}>
                            <SvgComponent className='svg-component' type='icon-bar-graph' />
                        </Col>
                        <Col xs={24} sm={8}>
                            <SvgComponent className='svg-component' type='icon-line-chart' />
                        </Col>
                        <Col xs={24} sm={8}>
                            <SvgComponent className='svg-component' type='icon-pie-chart' />
                        </Col>
                    </Row>
                </div> */}
                {/* <div className='author-say'>
                    {
                        strArr.map((i: string, index: number) => {
                            return <div className='animate-div' key={index}>{i}</div>
                        })
                    }
                </div> */}
            </div>
        )
    }
}
