import * as React from 'react';
import { ISettingContainerProps } from './interface';
import { IHeadTab, headTabs } from './index.config';
import { SettingPersonalContainer, ISettingPersonalProps } from './personal/index';
import SettingModifyPwdContainer from './modifyPassword/index';
import { cloneDeep } from 'lodash';
import { getUserBaseInfo } from 'common/utils/function';
import { message } from 'antd';
import { api } from 'common/api/index';
import { IQueryPersonResponse } from 'common/api/api-interface';
import './index.scss';

interface ISettingContainerState {
    headTabs: IHeadTab[];
    currentTab: string;
    personInfo: {
        img: string;
        userName: string;
        job: string;
        introduction: string;
        password: string;
        loginName: string;
        [key: string]: any;
    }
}

interface IConfig {
    userInfo: any
}

export default class SettingContainer extends React.Component<ISettingContainerProps, ISettingContainerState> {
    public config: IConfig;

    constructor(public props: ISettingContainerProps) {
        super(props);

        this.config = {
            userInfo: getUserBaseInfo()
        };

        this.state = {
            headTabs: cloneDeep(headTabs),
            currentTab: 'personal',
            personInfo: {
                img: '',
                userName: '',
                job: '',
                introduction: '',
                password: '',
                loginName: ''
            }
        };
    }

    public componentDidMount() {
        this.loadUserInfo();
    }

    /** 
     * @func
     * @desc 切换tab，显示不同的页面
     */
    public switchTab = (tab: IHeadTab) => {
        const headTabs: IHeadTab[] = this.state.headTabs.map((item: IHeadTab) => {
            item.selected = item.key === tab.key;
            return item;
        });

        this.setState({
            headTabs,
            currentTab: tab.value
        });
    }

    /** 
     * @func
     * @desc 加载用户信息
     */
    public loadUserInfo = () => {
        const { userInfo } = this.config;

        const params:FormData = new FormData();
        params.set('id', userInfo.teacherId);

        message.loading('加载数据中', 2);

        api.queryPerson(params).then((res: IQueryPersonResponse) => {
            if (res.status === 200 && res.data.success) {
                const { result } = res.data;

                const state = {
                    img: result.link || 'https://mirror-gold-cdn.xitu.io/1693d70320728da3b28?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
                    userName: result.userName,
                    job: result.position,
                    introduction: result.flag,
                    password: result.password,
                    loginName: result.loginName
                };

                this.setState({
                    personInfo: {...this.state.personInfo, ...state}
                });

                message.info('加载完成');
            } else {
                message.warn(res.data.desc);
            }
        });
    }

    public render() {
        const { loginName, password } = this.state.personInfo;

        const personalContainerProps: ISettingPersonalProps = this.state.personInfo;

        const modifyPwdContainer: any = {
            loginName,
            password
        };

        return <div className='setting-container'>
                    <div className='setting-head-tabs-box'>
                        <div className='inner-box'>
                            {
                                this.state.headTabs.map((tab: IHeadTab) => {
                                    return <span key={tab.key} className={`setting-head-tab-item ${tab.selected ? 'selected' : ''}`}
                                                onClick={() => this.switchTab(tab)}>
                                                { tab.name }
                                            </span>
                                })
                            }
                        </div>
                    </div>
                    <div className='setting-container-content'>
                        { this.state.currentTab === 'personal' && <SettingPersonalContainer {...personalContainerProps}/> }
                        { this.state.currentTab === 'modifyPassword' && <SettingModifyPwdContainer {...modifyPwdContainer}/> }
                    </div>
                </div>
    }
}