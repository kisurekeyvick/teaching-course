import * as React from 'react';
import UserLogin from './login/login';
import UserRegister from './register/register';
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

        const userProps = {
            param: this.props.match.params['status'],
            history: this.props.history
        };

        console.log('user props', this.props);

        return <div className='layout-login-box'>
                    <Row>
                        <Col span={24}>
                            <div className='layout-login-box-head'>
                                <img alt='logo' src={env.loginLogo} />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className='user-container-box'>
                                {
                                    userProps.param === 'login' ?
                                    <UserLogin {...loginProps}/> :
                                    <UserRegister />
                                } 
                            </div>
                        </Col>
                    </Row>
                </div>
    }
} 