import * as React from 'react';
import UserLogin from './login/login';
import { Row, Col } from 'antd';
import './user.scss';
import { getScreenInfo } from 'common/utils/function';

interface IProps {
    match: any
    history?: any;
}

interface IState {
    style: any;
}

export default class UserContainer extends React.Component<IProps, IState> {
    constructor(public props: IProps) {
        super(props);

        const { offsetHeight, offsetWidth } = getScreenInfo();

        this.state = {
            style: {
                width: offsetWidth + 'px',
                height: offsetHeight + 'px'
            }
        };
    }

    public componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * @func
     * @desc 处理屏幕发生变化
     */
    public handleResize = (e: any) => {
        const { offsetHeight, offsetWidth } = getScreenInfo();
        this.setState({
            style: {
                width: offsetWidth + 'px',
                height: offsetHeight + 'px'
            }
        });
    }

    public render() {
        const loginProps: any = {
            history: this.props.history
        };

        return <div className='user-system-login-box'>
                    {/* <img className='background-image' style={this.state.style} alt='logo' src={env.loginBackground}/> */}
                    <div className='login-content-box'>
                        <Row>
                            <Col span={24}>
                                <div className='user-container-box'>
                                    <UserLogin {...loginProps}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
} 