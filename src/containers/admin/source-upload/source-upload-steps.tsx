import * as React from 'react';
import { tabs, ITabItem } from './source-upload.config';
import { message } from 'antd';
import UploadStepFirstContainer from './step-first/step-first';
import UploadStepSecondContainer from './step-second/step-second';
import { UploadStepThirdContainer, IUploadStepThirdProps } from './step-third/step-third';
import { ITeachChapter } from './step-first/step-first.config';
import { IAddSectionResponseResultDataResult } from 'common/api/api-interface';
import './source-upload.scss';

interface ISourceUploadStepsProps {
    [key: string]: any;
}

interface IState {
    enableTabs: String[];
    currentTab: 'selectNode' | 'upload' | 'complete';
    courseNode: IAddSectionResponseResultDataResult | null;
    [key: string]: any;
}

export default class SourceUploadStepsContainer extends React.Component<ISourceUploadStepsProps, IState> {
    constructor(public props: ISourceUploadStepsProps) {
        super(props);

        this.state = {
            enableTabs: ['selectNode', 'upload'],
            currentTab: 'selectNode',
            courseNode: null
        };
    }

    /** 
     * @func
     * @desc 初始化courseNode
     */
    public initCourseNode = (): {
        materialId: string; 
        parentId: string;
        chapterId: string;
        teachChapter: ITeachChapter;
    } => {
        return {
            materialId: '',
            parentId: '',
            chapterId: '',
            teachChapter: {
                desc: '',
                name: '',
                fileFormat: 0,
                fileType: 0,
                weight: 0
            }
        }
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
     * @desc 完成第一步：填写资源信息
     */
    public handleUploadStepFirst = (result:IAddSectionResponseResultDataResult) => {
        const { enableTabs } = this.state;
        console.log(result);
        enableTabs.push('upload');
        this.setState({
            enableTabs,
            currentTab: 'upload',
            courseNode: result
        });
    }

    /** 
     * @func
     * @desc 完成第二部：上传资源
     */
    public handleUploadStepSecond = () => {
        const { enableTabs } = this.state;
        enableTabs.push('complete');

        this.setState({
            currentTab: 'complete',
        });
    }

    /** 
     * @func
     * @desc 继续上传
     */
    public uploadAgain = () => {
        this.setState({
            enableTabs: ['selectNode'],
            currentTab: 'selectNode',
            courseNode: null
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
        const { currentTab, courseNode } = this.state;
        const uploadStepFirstProps: any = {
            successCallBack: this.handleUploadStepFirst
        };
        const uploadStepSecondProps: any = {
            successCallBack: this.handleUploadStepSecond,
            courseNode
        };
        const uploadStepThirdProps: IUploadStepThirdProps = {
            history: this.props.history,
            uploadAgain: this.uploadAgain
        };

        return (
            <div className='upload-container animateCss'>
                <div className='nav-head'>
                    { this.buildTabs() }
                </div>
                <div className='content-box'>
                    { currentTab === 'selectNode' && <UploadStepFirstContainer {...uploadStepFirstProps}/> }
                    { currentTab === 'upload' && <UploadStepSecondContainer {...uploadStepSecondProps}/> }
                    { currentTab === 'complete' && <UploadStepThirdContainer {...uploadStepThirdProps}/> }
                </div>
            </div>
        )
    }
}