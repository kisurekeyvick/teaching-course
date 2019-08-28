import * as React from 'react';
import { Form, Input, Button, Checkbox, Icon, Tabs, Row, Col} from 'antd';
import { Link } from "react-router-dom";
import * as _ from 'lodash';
// import moment from 'moment';
import { IForm, loginFormItem, loginPhoneFormItem } from './login-config';
import { CookieService } from 'common/utils/cache/cookie';
import { validTelePhone } from 'common/utils/validator';
// import { api } from '../../../common/api/index';
import LocalStorageService from 'common/utils/cache/local-storage';
import './login.scss';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

interface IProps {
    history?: any;
    [key: string]: any;
}

class UserLogin extends React.PureComponent<IProps, any> {
    private _cookie: CookieService;
    public localStorageService: LocalStorageService;
    public config: any;
    public timeInterval: any;

    constructor(public props: IProps) {
        super(props);

        this.state = {
            seconds: 0,
            verificationImage: ''
        };

        this.config = {
            loginFormItem: _.cloneDeep(loginFormItem),
            loginPhoneFormItem: this.rebuildFormItem(_.cloneDeep(loginPhoneFormItem)),
            tabIndex: '1'
        };

        this._cookie = new CookieService();
        this.localStorageService = new LocalStorageService();
    }

    /**
     * 重新配置表单
     *
     * @memberof UserLogin
     */
    public rebuildFormItem = (formItems: IForm[]): IForm[] => {
        return formItems.map((item: IForm) => {
            switch(item.key) {
                case 'phone':
                    item.config.rule.push({ validator: this.validTelePhone });
                    break;
                default:
                    break;
            }

            return item;
        });
    }

    /**
     * 手机号码验证
     *
     * @memberof UserLogin
     */
    public validTelePhone = (rule: any, value: any, callback: any) => {
        if (!validTelePhone(value) && value !== '' && value !== undefined)
            callback('请输入正确格式的手机号！');

        callback();
    }

    /**
     * tab切换
     * @param e tab切换返回默认参数key
     * @memberof UserLogin
     */
    public tabCallback = (e: string) => {
        this.config.tabIndex = e;
    }

    /**
     * 短信验证码发送
     * @param e
     * @memberof UserLogin
     */
    public sendVerificationCode = (e: any) => {
        this.props.form.validateFields(['phone'], (error: any, value: any) => {
            if (!error)
                this.updateSeconds(120);
        });
    }

    /**
     * 更新seconds
     * @param num 设置秒数
     * @memberof UserLogin
     */
    public updateSeconds = (num: number) => {
        this.setState({ seconds: num });

        this.timeInterval = setInterval(() => {
            num -= 1;
            this.setState({ seconds: num });
            if (num === 0)
                clearInterval(this.timeInterval);
        }, 1000);
    }

    /**
     * @func
     * @desc 获取验证码图片
     * @memberof UserLogin
     */
    public getverificationImage = () => {
        const userInfo: any = this.localStorageService.get('userInfo');
        const token = userInfo.token || '';
        const imgUrl = `${window.location.origin}/project1/getRandCode?token=${token}&time=${new Date().getTime()}`;

        fetch(imgUrl).then(res => {
            return res.blob();
        }).then(res => {
            const imgUrl: string = URL.createObjectURL(res);
            this.setState({
                verificationImage: imgUrl
            });
        });
    }

    /**
     * 账号登录
     * @param e 
     * @memberof UserLogin
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        this.props.form.validateFields((error: any, value: any) => {
            let params: any = null;

            if (this.config.tabIndex === '1' && !error.hasOwnProperty('userName') && !error.hasOwnProperty('password'))
                params = { 
                    userName: value['userName'],
                    password: value['password'],
                    remember: value['remember'],
                };
            else if (this.config.tabIndex === '2' && !error.hasOwnProperty('phone') && !error.hasOwnProperty('verificationCode'))
                params = {
                    phone: value['phone'],
                    verificationCode: value['verificationCode'],
                    remember: value['remember'],
                };

            if (params) {
                // api.userLogin(params).then((res: any) => {
                //     if (res && res.status === 200) {
                //         const endTime: any = params['remember'] ? moment().add(30, 'days').toDate() : '';

                //         for(const key in res.data.result) {
                //             this._cookie.setCookie(`_${key}`, res.data.result[key], endTime);
                //         }
                        
                //         this.props.history.push('/saas/customer/list');
                //     }
                // }); 
                // api.login.post()

                // Todo 这一步需要后端接口
                // const endTime: any = params['remember'] ? moment().add(30, 'days').toDate() : '';
                // this._cookie.setCookie('_token', 'YYTDHDSASDFGHFDSDFVGBNGFDS', endTime);
                this.props.history.push('/home');
            }
        });
    }

    /**
     * 创建formItem
     * @param item 
     * @memberof UserLogin
     */
    public createForm = (form: IForm, getFieldDecorator:any) => {
        let formItem: any;
        
        switch(form.type) {
            case 'input':
                const inputItem = getFieldDecorator(form.key, {
                    initialValue: form.config.initialValue,
                    rules: form.config.rule || []
                })( <Input prefix={<Icon type={form.config.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} size='large' key={`input-${form.id}`} placeholder={form.placeholder} type={form.config.type || 'text'}/> )

                if ( form.key === 'verificationCode' ) {
                    formItem = <div key={`input-button-${form.id}`}>
                                    <Row gutter={8}>
                                        <Col span={16}>
                                            { inputItem }
                                        </Col>
                                        <Col span={8}>
                                            <Button style={{width: '100%'}} size='large' disabled={this.state.seconds > 0} onClick={this.sendVerificationCode}>
                                                { this.state.seconds > 0 ? `${this.state.seconds}秒` : '获取验证码' }
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                } else if ( form.key === 'verificationImageCode' ) {
                    formItem = <div key={`input-button-${form.id}`}>
                                    <Row gutter={8}>
                                        <Col span={16}>
                                            { inputItem }
                                        </Col>
                                        <Col span={8}>
                                            {
                                                this.state.verificationImage ?
                                                <img alt='验证码' className='verificationImage' src={this.state.verificationImage} onClick={this.getverificationImage}/> :
                                                <Button style={{width: '100%'}} size='large' onClick={this.getverificationImage}>
                                                    获取图片
                                                </Button>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                } else 
                    formItem = inputItem;
                break;
            case 'checkbox-group':
                formItem = <div key={`checkbox-group-${form.id}`}>
                                {
                                    getFieldDecorator(form.key, {
                                        initialValue: form.config.initialValue,
                                        valuePropName: 'checked',
                                    })( <Checkbox className='checkbox-remember'>记住密码</Checkbox> )
                                }
                                <p key={`checkbox-group-a-${form.id}`} className="login-form-forgot">忘记密码?</p>
                                <Button size='large' type="primary" htmlType="submit" className="login-form-button">登录</Button>
                                <div className='other-login'>
                                    <span>其他登陆方式</span>
                                    <Icon type="alipay-circle" className='other-login-icon' theme="outlined" />
                                    <Icon type="taobao-circle" className='other-login-icon' theme="outlined" />
                                    <Icon type="weibo-circle" className='other-login-icon' theme="outlined" />
                                    <Link to='/user/register'>注册账户</Link>
                                </div>
                            </div>;
                break;
            default:
                formItem = null; 
                break;
        }

        return formItem;
    }

    public componentWillUnmount() {
        this.timeInterval && clearInterval(this.timeInterval);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;

        return(
            <div className='user-login'>
                <Form className='user-login-form' onSubmit={this.handleSubmit}>
                    <Tabs defaultActiveKey='1' onChange={this.tabCallback}>
                        <TabPane tab='账号密码登录' key='1'>
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
                        </TabPane>
                        <TabPane tab='手机号登录' key='2'>
                            {
                                this.config.loginPhoneFormItem.map((item: IForm, index: number) => {
                                    return <FormItem
                                            className='formItem-item'
                                            key={item.key + '' + item.id}
                                            hasFeedback={item.hasFeedback || false}>
                                            { this.createForm(item, getFieldDecorator) }
                                            </FormItem>
                                })
                            }
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        );
    }
}

export default Form.create()(UserLogin);
