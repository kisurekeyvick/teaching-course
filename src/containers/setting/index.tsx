import * as React from 'react';
import { ISettingContainerProps } from './interface';
import { IHeadTab, headTabs } from './index.config';
import SettingPersonalContainer from './personal/index';
import SettingModifyPwdContainer from './modifyPassword/index';
import * as _ from 'lodash';
import './index.scss';

interface ISettingContainerState {
    headTabs: IHeadTab[];
    currentTab: string;
}

export default class SettingContainer extends React.Component<ISettingContainerProps, ISettingContainerState> {
    constructor(public props: ISettingContainerProps) {
        super(props);

        this.state = {
            headTabs: _.cloneDeep(headTabs),
            currentTab: 'personal'
        };
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

    public render() {
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
                        { this.state.currentTab === 'personal' && <SettingPersonalContainer /> }
                        { this.state.currentTab === 'modifyPassword' && <SettingModifyPwdContainer /> }
                    </div>
                </div>
    }
}