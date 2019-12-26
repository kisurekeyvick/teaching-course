import * as React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateRouteHistory } from 'store/globalLayout/action';

interface IHiddenRouteProps {
    pushRouteHistory: Function;
    [key: string]: any;
}

class HiddenRouteContainer extends React.PureComponent<IHiddenRouteProps, any> {
    constructor(public props: IHiddenRouteProps) {
        super(props);
    }

    componentDidMount() {
        this.props.pushRouteHistory(this.props.history);
    }

    public render() {
        return (
            <div/>
        )
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return {
        pushRouteHistory: bindActionCreators(updateRouteHistory, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HiddenRouteContainer);
