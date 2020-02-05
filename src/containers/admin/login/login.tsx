import * as React from 'react';
import { Form, Input, Button, Icon, Row, Col } from 'antd';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import LocalStorageService from 'common/utils/cache/local-storage';
import './login.scss';
import {connect} from 'react-redux';
import { AdminLoginFormItem, LoginParams, IConfig, IForm } from './login-config';
import { getScreenInfo, messageFunc } from 'common/utils/function';
import { LocalStorageItemName } from 'common/service/localStorageCacheList';
import { api } from 'common/api/index';
import { ILogin } from 'common/api/api-interface';
import { StorageItemName } from 'common/utils/cache/storageCacheList';
import { loginBgPic, loginLogo } from 'common/service/img-collection';

const FormItem = Form.Item;

interface IProps {
    history?: any;
    [key: string]: any;
}

interface IState {
    style: any;
    errorMsg: string;
    isLoading: boolean;
}

class AdminLogin extends React.PureComponent<IProps, IState> {
    public localStorageService: LocalStorageService;
    public config: IConfig;

    constructor(public props: IProps) {
        super(props);

        this.localStorageService = new LocalStorageService();

        this.config = {
            loginFormItem: cloneDeep(AdminLoginFormItem)
        };

        const { offsetHeight, offsetWidth } = getScreenInfo();

        this.state = {
            style: {
                width: offsetWidth + 'px',
                height: offsetHeight + 'px'
            },
            errorMsg: '',
            isLoading: false
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

    /**
     * 账号登录
     * @param e 
     * @memberof AdminLogin
     */
    public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.form.validateFields((error: any, value: LoginParams) => {
            if (!error) {
                const params = {
                    loginName: value.userName,
                    password: value.password
                };

                const loading = messageFunc('正在登录中...');

                this.setState({
                    isLoading: true
                });

                api.login(params).then((res: ILogin) => {
                    const { data: { success, isAdministrators, desc, result }, headers } = res;
                    if (res.status === 200 && success) {
                        if (isAdministrators) {
                            this.saveToLocalStorage({ params, headers, result }).then(() => {
                                // this.props.history.push('/admin/system/upload');
                                window.location.href = '/admin/system/upload';
                                loading.success(desc);
                            });
                        } else {
                            loading.warn('您不是管理员，无法登陆后台操作界面。');
                            this.setState({
                                errorMsg: '非管理员，无法登陆。',
                                isLoading: false
                            });
                        }
                    } else {
                        loading.error(desc);
                        this.setState({
                            errorMsg: desc,
                            isLoading: false
                        });
                    }
                });
            }
        })
    }

    /** 
     * @func
     * @desc 存储信息到本地
     */
    public saveToLocalStorage = ({ params, headers, result }: any): Promise<string> => {
        return new Promise((resovle) => {
            this.rememberAdminPage({...params, token: headers.token});
            this.localStorageService.set(StorageItemName.TOKEN, { token: headers.token });
            // 更新user界面的账号信息
            const userInfo = this.localStorageService.get(StorageItemName.LOGINCACHE);
            const value = userInfo ? {...userInfo.value, ...result} : {...result};
            const endTime: any = dayjs().add(30, 'day').toDate();
            this.localStorageService.set(StorageItemName.LOGINCACHE, value, endTime);

            resovle('');
        });
    }

    /** 
     * @func
     * @desc 存储后台页面信息
     */
    public rememberAdminPage = (value: LoginParams) => {
        const endTime: any = dayjs().add(30, 'day').toDate();
        this.localStorageService.set(LocalStorageItemName.BEHINDLOGINCACHE, value, endTime);
        this.localStorageService.set(LocalStorageItemName.PAGETYPE, { type: 'behind' });
    }

    /**
     * 创建formItem
     * @param item 
     * @memberof LoginLogin
     */
    public createForm = (form: IForm, getFieldDecorator:any) => {
        let formItem: React.ReactNode;

        switch(form.type) {
            case 'input':
                const inputItem = getFieldDecorator(form.key, {
                    initialValue: form.config.initialValue,
                    rules: form.config.rule || []
                })( <Input className={`input-control ${form.key}`} size={form.size || 'default'} prefix={<Icon type={form.config.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} key={`input-${form.id}`} placeholder={form.placeholder} type={form.config.type || 'text'}/> )

                formItem = <div className='formItem-div'>
                                <label className='formItem-label'>{ form.label }</label>
                                { inputItem }
                            </div>;
                break;
            default:
                formItem = null; 
                break;
        }

        return formItem;
    }

    /** 
     * @callback
     * @desc 返回用户登录页
     */
    public handBackToUserPageClick = () => {
        this.localStorageService.set(LocalStorageItemName.PAGETYPE, { type: 'front' });
        window.location.href = '/user/login';
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        const { errorMsg, isLoading } = this.state;

        return (
            <div className='layout-login-box'>
                <img className='background-image' style={this.state.style} alt='logo' src={loginBgPic}/>
                <div className='login-content-box'>
                    <Row>
                        <Col span={24}>
                            <div className='layout-login-box-head'>
                                <img alt='logo' src={loginLogo} />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className='user-container-box'>
                                <div className='admin-login'>
                                    <Form className='admin-login-form' onSubmit={this.handleSubmit}>
                                        <p className='login-title'>城市轨道交通教学资源管理系统-后台管理登录</p>
                                        {
                                            this.config.loginFormItem.map((item: IForm, index: number) => {
                                                return <FormItem
                                                            className='formItem-item'
                                                            key={item.key + '' + item.id}
                                                            hasFeedback={item.hasFeedback || false}>
                                                            { this.createForm(item, getFieldDecorator) }
                                                        </FormItem>
                                            })
                                        }
                                        <FormItem>
                                            {
                                                errorMsg && <p className='error-message error-animate'>{errorMsg}</p>
                                            }
                                            <div>
                                                <Row gutter={24}>
                                                    <Col span={10}>
                                                        <Button size='large' disabled={isLoading} type="primary" htmlType="submit" className={`login-form-button ${isLoading ? 'isLoading' : ''}`} >登录</Button>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Button size='large' onClick={this.handBackToUserPageClick} className="login-form-button">返回用户登录页</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </FormItem>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {
        // updateUserInfo: bindActionCreators(updateUserInfo, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AdminLogin));


