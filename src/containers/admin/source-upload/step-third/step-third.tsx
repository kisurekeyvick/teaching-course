import * as React from 'react';
import { Result, Button } from 'antd';
import './step-third.scss';

export interface IUploadStepThirdProps {
    history: any;
    uploadAgain: Function;
    [key: string]: any;
}

interface IState {
    [key: string]: any;
}

export class UploadStepThirdContainer extends React.PureComponent<IUploadStepThirdProps, IState> {
    constructor(public props: IUploadStepThirdProps) {
        super(props);
    }

    /** 
     * @callback
     * @desc 前往资源管理
     */
    public stateToSourceManage = () => {
        const { history } = this.props;
        history.push('/admin/system/sourceManage');
    }

    /** 
     * @callback
     * @desc 继续上传
     */
    public repeatUploadSource = () => {
        this.props.uploadAgain();
    }

    public render() {
        return <div>
                    <Result
                        status='success'
                        title='太棒了！您已经完成资源上传所有步骤！'
                        extra={[
                        <Button type='primary' key='console' onClick={this.stateToSourceManage}>
                            点击前往资源管理
                        </Button>,
                        <Button key='buy' onClick={this.repeatUploadSource}>继续上传资源</Button>,
                        ]}
                    />
                </div>
    }
}
