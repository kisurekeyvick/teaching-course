import * as React from 'react';
import { Button, Upload, Icon, Input, message } from 'antd';
import { IControl, controlArray } from './index.config';
import { api } from 'common/api/index';
import { IPersonUpdateRequestParams, IPersonUpdateResponseResult } from 'common/api/api-interface';
import { getUserBaseInfo } from 'common/utils/function';
import './index.scss';

interface IConfig {
    userInfo: any
}

interface IState {
    img: string;
    userName: string;
    userNameControlFocus: boolean;
    job: string;
    jobControlFocus: boolean;
    introduction: string;
    introductionControlFocus: boolean;
    isLoading: boolean;
    [key: string]: any;
}

export interface ISettingPersonalProps {
    img: string;
    userName: string;
    job: string;
    introduction: string;
    password: string;
    loginName: string;
    [key: string]: any;
}

export class SettingPersonalContainer extends React.PureComponent<ISettingPersonalProps, IState> {
    public config: IConfig;

    constructor(public props: ISettingPersonalProps) {
        super(props);

        this.state = {
            img: '',
            userName: '',
            userNameControlFocus: false,
            job: '',
            jobControlFocus: false,
            introduction: '',
            introductionControlFocus: false,
            isLoading: false
        };

        this.config = {
            userInfo: getUserBaseInfo()
        }
    }

    static getDerivedStateFromProps(props: ISettingPersonalProps, state: IState) {
        if (props.loginName) {
            const { img, introduction, userName, job } = props;
            return {
                img,
                userName,
                job,
                introduction,
            };
        }

        return null;
    }

    componentDidMount() {
    }

    /** 
     * @func
     * @desc 修改input的focus状态
     */
    public controlFocus = (stateName: string, isFocus: boolean) => {
        const state: {[key: string]: boolean} = {};
        controlArray.map(item => item.focusStateName).forEach((i: string) => {
            state[i] = i === stateName ? isFocus : false;
        });

        this.setState({
            ...state
        });
    }

    /** 
     * @func
     * @desc 控件发生变化
     */
    public controlChange = (e: any, stateName: string) => {
        this.setState({
            [stateName]: e.target.value
        });
    }

    /** 
     * @func
     * @desc 控件值保存
     */
    public save = (stateName: string, focusStateName: string) => {
        this.setState({
            [focusStateName]: false
        });
    }

    /** 
     * @func
     * @desc 控件值还原
     */
    public cancel = (stateName: string, focusStateName: string) => {
        this.setState({
            [stateName]: this.props[stateName],
            [focusStateName]: false
        });
    }

    /** 
     * @func
     * @desc 编辑
     */
    public edit = (focusStateName: string) => {
        this.controlFocus(focusStateName, true);
    }

    /** 
     * @callback
     * @desc 更新老师信息
     */
    public updateTeacherInfo = () => {
        const { loginName, password } = this.props;

        const params: IPersonUpdateRequestParams = {
            loginName,
            password
        };

        api.updateTeacher(params).then((res: IPersonUpdateResponseResult) => {
            if (res.status === 200) {
                res.data.success && message.success('修改成功');
            } else {
                message.error('修改失败');
            }
        });
    }

    public render() {
        return <div className='setting-personal-box animateCss'>
                    <p className='title'>个人资料</p>
                    <div className='setting-item head-portrait'>
                        <label>头像</label>
                        <div className='upload-img-control-box'>
                            <div className='upload-img-control-inner-box'>
                                <img alt='头像' src={this.state.img} />
                                <div className='desc-and-upload'>
                                    <p>支持 jpg、png 格式大小 5M 以内的图片</p>
                                    <Upload>
                                        <Button type="primary" >
                                            <Icon type="upload" />点击上传
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        controlArray.map((item: IControl) => {
                            return <div className={`setting-item ${item.className}`} key={item.key}>
                                    <label>{item.name}</label>
                                    <div className='content'>
                                        <div className='inner-content'>
                                            <Input className='input-control' type='text' value={this.state[item.stateName]} onChange={(e) => this.controlChange(e, item.stateName)} 
                                                onFocus={() => this.controlFocus(item.focusStateName, true)}
                                                placeholder={item.placeholder}/>
                                            <div className={`operation ${!this.state[item.focusStateName] ? 'hover' : ''}`}>
                                                { this.state[item.focusStateName] && <React.Fragment>
                                                    <span className='span-save' onClick={() => this.save(item.stateName, item.focusStateName)}>保存</span>
                                                    <span className='span-cancel' onClick={() => this.cancel(item.stateName, item.focusStateName)}>取消</span>
                                                </React.Fragment> }
                                                { !this.state[item.focusStateName] && <span className='edit-span' onClick={() => this.edit(item.focusStateName)}><Icon className='edit-icon' type="edit" />修改</span> }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        })
                    }
                    <div className='submit-box'>
                        <Button type="primary" onClick={this.updateTeacherInfo}>
                            保存修改
                        </Button>
                    </div>
                </div>
    }
}