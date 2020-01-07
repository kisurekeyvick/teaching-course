import React from 'react';
import { ITabItem, tabs } from './index.config';
import { ITeachChapterResList } from 'common/api/api-interface';
import { message } from 'antd';
import './index.scss';

interface IState {
    enableTabs: String[];
    currentTab: 'account' | 'detailInfo';
    updateTime: number;
    userInfo: ITeachChapterResList | null;
    [key: string]: any;
}

interface IUserFormModifyProps {
    userInfo: ITeachChapterResList | null;
    updateTime: number;
    [key: string]: any;
}

export class UserFormModifyContainer extends React.PureComponent<IUserFormModifyProps, IState> {
    constructor(public props: IUserFormModifyProps) {
        super(props);

        this.state = {
            enableTabs: ['account'],
            currentTab: 'account',
            userInfo: null,
            updateTime: 0
        };
    }

    static getDerivedStateFromProps(nextProps: IUserFormModifyProps, prevState: IState) {
        if (nextProps.updateTime > prevState.updateTime) {
            const { userInfo } = nextProps;

            return {
                enableTabs: userInfo ? ['account', 'detailInfo'] : ['account'],
                userInfo
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
            message.warn('请按照步骤进行相关操作！');
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
            enableTabs
        });
    }

    public render() {
        return (
            <div className=''>

            </div>
        )
    }
}
