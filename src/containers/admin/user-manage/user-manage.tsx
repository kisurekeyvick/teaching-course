import * as React from 'react';
import './user-manage.scss';

interface IUserManageContainerProps {
    [key: string]: any;
}

interface IState {
    [key: string]: any;
}

class UserManageContainer extends React.PureComponent<IUserManageContainerProps, IState> {
    constructor(public props: IUserManageContainerProps) {
        super(props);
    }

    public render() {
        return (
            <div className='user-manage-container animateCss'>
                用户管理
            </div>
        )
    }
}

export default UserManageContainer;
