import * as React from 'react';
import { Button, Upload, Icon, Input, message } from 'antd';
import { IStoreState, IControl, controlArray } from './index.config';
import './index.scss';

export default class SettingPersonalContainer extends React.PureComponent<any, any> {
    /** 状态值备份 */
    public storeState: IStoreState;

    constructor(public props: any) {
        super(props);

        this.state = {
            img: '',
            userName: '',
            userNameControlFocus: false,
            job: '',
            jobControlFocus: false,
            introduction: '',
            introductionControlFocus: false
        };

        this.storeState = {
            userName: '',
            job: '',
            introduction: ''
        };
    }

    componentDidMount() {
        this.loadUserInfo();
    }

    /** 
     * @func
     * @desc 加载用户信息
     */
    public loadUserInfo = () => {
        this.setState({
            img: 'https://mirror-gold-cdn.xitu.io/1693d70320728da3b28?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1',
            userName: 'Nice fish',
            job: '搬砖工',
            introduction: '唱跳rap篮球'
        }, () => {
            this.storeState = {
                userName: 'Nice fish',
                job: '搬砖工',
                introduction: '唱跳rap篮球'
            };
        });
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
        this.storeState[stateName] = this.state[stateName];
        this.setState({
            [focusStateName]: false
        }, () => {
            message.success('保存成功');
        });
    }

    /** 
     * @func
     * @desc 控件值还原
     */
    public cancel = (stateName: string, focusStateName: string) => {
        console.log('取消');

        this.setState({
            [stateName]: this.storeState[stateName],
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
                </div>
    }
}