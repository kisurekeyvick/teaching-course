import * as React from 'react';
import Exception from 'components/exception/exception-component';

export default class ExceptionComponent extends React.PureComponent<any, any> {
    constructor(public props: any) {
        super(props);
    }

    /**
     * 页面跳转
     * @params url 跳转的路径
     * @memberof ExceptionComponent
     */
    public skipTo = (url: string) => {
        const { history } = this.props;
        const to: string = `${url}`;
        history.push(to);
    }

    public render() {
        const props = {
            type: '404',
            backText: '返回资源上传',
            redirect: '/admin/system/upload',
            linkTo: this.skipTo
        };

        return(
            <Exception {...props}/>
        );
    }
}
