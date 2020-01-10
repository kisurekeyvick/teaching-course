import React from 'react';
import { ITabItem, tabs } from './index.config';
import { IQueryPersonDataResult } from 'common/api/api-interface';
import { message } from 'antd';
import UserModifyStepFirstContainer from './step-first/step-first';
import { IAccountInfo } from 'common/api/api-interface';
import UserModifyStepSecondContainer from './step-second/step-second';
import './index.scss';

interface IState {
    enableTabs: String[];
    currentTab: 'account' | 'detailInfo';
    updateTime: number;
    userInfo: IQueryPersonDataResult | null;
    operation: 'add' | 'edit' | null;
    [key: string]: any;
}

export interface IUserFormModifyProps {
    userInfo: IQueryPersonDataResult | null;
    updateTime: number;
    operation: 'add' | 'edit' | null;
    eventEmitterFunc: Function; 
    [key: string]: any;
}

export class UserFormModifyContainer extends React.PureComponent<IUserFormModifyProps, IState> {
    constructor(public props: IUserFormModifyProps) {
        super(props);

        this.state = {
            enableTabs: ['account'],
            currentTab: 'account',
            userInfo: null,
            updateTime: 0,
            operation: null
        };
    }

    static getDerivedStateFromProps(nextProps: IUserFormModifyProps, prevState: IState) {
        if (nextProps.updateTime > prevState.updateTime) {
            const { userInfo, operation } = nextProps;

            return {
                enableTabs: userInfo ? ['account', 'detailInfo'] : ['account'],
                userInfo,
                operation
            }
        }
        
        return null;
    }

    /** 
     * @func
     * @desc 处理tab点击功能
     */
    public handleTabClick = (tab: ITabItem) => {
        const { enableTabs } = this.state;
        const currentTab = tab.value;

        if (enableTabs.includes(currentTab)) {
            this.setState({
                currentTab
            });
        } else {
            message.warn('请先创建账号再进行个人信息填写！');
        }
    }

    /** 
     * @func
     * @desc 步骤一，账号配置完成
     */
    public handleStepFirst = () => {
        const { enableTabs } = this.state;

        enableTabs.length === 1 && enableTabs.push('detailInfo');

        this.setState({
            currentTab: 'detailInfo',
            enableTabs,
            operation: 'edit',
            updateTime: Date.now()
        });
    }

    /** 
     * @func
     * @desc 处理account成功
     */
    public handleUserModifyStepFirstCb = (account: IAccountInfo) => {
        this.handleStepFirst();
        this.setState({
            userInfo: account,
            updateTime: Date.now()
        });
    }

    /** 
     * @func
     * @desc 处理修改用户信息成功
     */
    public handleUserModifyStepSecondCb = () => {
        this.props.eventEmitterFunc({
            hideDrawer: true
        });
    }

    /** 
     * @func
     * @desc 构建头部步骤
     */
    public buildTabs = (): React.ReactNode => {
        const { enableTabs, currentTab } = this.state;

        return <>
            {
                tabs.map((item: ITabItem) => {
                    return <span className={`nav-item ${currentTab === item.value ? 'selected' : ''} ${enableTabs.includes(item.value) ? 'complete' : ''}`} 
                            key={item.key} onClick={() => this.handleTabClick(item)}>{item.name}</span>
                })
            }
        </>
    }

    public render() {
        const { currentTab, userInfo, operation } = this.state;
        
        const userModifyStepFirstProps: any = {
            operation,
            successCallBack: this.handleUserModifyStepFirstCb,
            userInfo
        };
        
        const userModifyStepSecondprops: any = {
            userInfo,
            eventEmitterFunc: this.handleUserModifyStepSecondCb
        };

        return (
            <div className='user-form-edit-container'>
                <div className='nav-head'>
                    { this.buildTabs() }
                </div>
                { currentTab === 'account' && <UserModifyStepFirstContainer {...userModifyStepFirstProps}/> }
                { currentTab === 'detailInfo' && <UserModifyStepSecondContainer {...userModifyStepSecondprops}/> }
            </div>
        )
    }
}
