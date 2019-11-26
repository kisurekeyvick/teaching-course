import * as React from 'react';
import UserLogin from './login/login';
import { Row, Col} from 'antd';
import { env } from 'environment/index';
import './user.scss';

interface IProps {
    match: any
    history?: any;
}

export default class UserContainer extends React.Component<IProps, any> {
    constructor(public props: IProps) {
        super(props);
    }

    public render() {
        const loginProps: any = {
            history: this.props.history
        };

        return <div className='layout-login-box'>
                    <div className='login-content-box'>
                        <Row>
                            <Col span={24}>
                                <div className='layout-login-box-head'>
                                    <img alt='logo' src={env.loginLogo} />
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className='user-container-box'>
                                    <UserLogin {...loginProps}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
    }
} 