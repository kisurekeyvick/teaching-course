import * as React from 'react';
import './index.scss';

export default class SettingModifyPwdContainer extends React.PureComponent<any, any> {
    constructor(public props: any) {
        super(props);
    }

    public render() {
        return <div className='setting-modifyPwd-box'>
            <div>修改密码</div>
        </div>
    }
}
