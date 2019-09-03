import * as React from 'react';
import './index.scss';

export default class SettingPersonalContainer extends React.PureComponent<any, any> {
    constructor(public props: any) {
        super(props);
    }

    public render() {
        return <div className='setting-personal-box'>
            <div>个人资料</div>
        </div>
    }
}