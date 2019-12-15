import * as React from 'react';
import { Form, Input, Button, Checkbox, Icon, Row, Col, message } from 'antd';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { IForm, loginFormItem } from './login-config';
import { CookieService } from 'common/utils/cache/cookie';
import { api } from 'common/api/index';
import LocalStorageService from 'common/utils/cache/local-storage';
import './login.scss';
import {connect} from 'react-redux';
import { updateUserInfo } from 'store/user/action';
import { bindActionCreators } from 'redux';
import { LoginParams } from 'containers/user/interface';
import { StorageItemName } from 'common/utils/cache/storageCacheList';
import { ILogin } from 'common/api/api-interface';

const FormItem = Form.Item;

interface IProps {
    history?: any;
    [key: string]: any;
}

interface IState {
    verificationImage: string;
    errorMsg: string;
}

class UserLogin extends React.PureComponent<IProps, IState> {
    private _cookie: CookieService;
    public localStorageService: LocalStorageService;
    public config: any;
    public timeInterval: any;

    constructor(public props: IProps) {
        super(props);

        this.state = {
            errorMsg: '',
            verificationImage: ''
        };

        this.config = {
            loginFormItem: cloneDeep(loginFormItem),
            tabIndex: '1'
        };

        this._cookie = new CookieService();
        this.localStorageService = new LocalStorageService();
    }

    /**
     * @func
     * @desc 当组件完成挂载以后
     */
    public componentDidMount() {
        this.readRememberPwd();
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
     * @func
     * @desc TODO 记住账号密码
     */
    public rememberPwd = (value: any) => {
        const endTime: any = dayjs().add(30, 'day').toDate();
        // Todo 写死的token，后面需要后端传递
        value['token'] = 'YTDFJHDGFHJHDGRDTFYHDTGDHFHDTF';
        this.localStorageService.set(StorageItemName.LOGINCACHE, value, endTime);
    }

    /** 
     * @func
     * @desc 不记住账号密码
     */
    public forgetPwd = () => {
        this.localStorageService.remove(StorageItemName.LOGINCACHE);
    }

    /**
     * @func
     * @desc 读取账号密码
     */
    public readRememberPwd = () => {
        const loginInfo = this.localStorageService.get(StorageItemName.LOGINCACHE);

        if (loginInfo) {
            const { value } = loginInfo;
            this.props.form.setFieldsValue({
                userName: value.loginName,
                password: value.password,
                remember: value.remember
            });
        }
    }

    /**
     * 账号登录
     * @param e 
     * @memberof UserLogin
     */
    public handleSubmit = (e: any) => {
        e.preventDefault();

        this.props.form.validateFields((error: any, value: LoginParams) => {
            if (!error) {
                const params = {
                    loginName: value.userName,
                    password: value.password
                };

                api.login(params).then((res: ILogin) => {
                    if (res.status === 200) {
                        const { data: { success, result, isAdministrators, desc }, headers } = res;

                        /** 登录不成功 */
                        if (!success) {
                            message.error(desc);
                            this.setState({
                                errorMsg: desc
                            })
                        } else {
                            this.props.updateUserInfo({...result, isAdministrators});
                            value.remember ? this.rememberPwd({...result, isAdministrators, remember: true}) : this.forgetPwd();
                            this.localStorageService.set(StorageItemName.PAGETYPE, { type: 'front' });
                            this.localStorageService.set(StorageItemName.TOKEN, { token: headers.token });
                            this.props.history.push('/book');
                        }
                    }
                });
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
        const { errorMsg } = this.state;
        
        switch(form.type) {
            case 'input':
                const inputItem = getFieldDecorator(form.key, {
                    initialValue: form.config.initialValue,
                    rules: form.config.rule || []
                })( <Input className={`input-control ${form.key}`} size={form.size || 'default'} prefix={<Icon type={form.config.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} key={`input-${form.id}`} placeholder={form.placeholder} type={form.config.type || 'text'}/> )

                if ( form.key === 'verificationImageCode' ) {
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
                } else {
                    formItem = <div className='formItem-div'>
                        <label className='formItem-label'>{ form.label }</label>
                        { inputItem }
                    </div>;
                } 
                break;
            case 'checkbox-group':
                formItem = <div key={`checkbox-group-${form.id}`}>
                                {
                                    getFieldDecorator(form.key, {
                                        initialValue: form.config.initialValue,
                                        valuePropName: 'checked',
                                    })( <Checkbox className='checkbox-remember'>记住密码</Checkbox> )
                                }
                                { errorMsg && <p className='error-message error-animate'>{ errorMsg }</p> }
                                <Button size='large' type="primary" htmlType="submit" className="login-form-button">登录</Button>
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
                    <p className='login-title'>登录</p>
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
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {
        updateUserInfo: bindActionCreators(updateUserInfo, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(UserLogin));
