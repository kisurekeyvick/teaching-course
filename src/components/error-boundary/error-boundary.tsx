import React, { ErrorInfo } from 'react';
import './error-boundary.scss';

interface IErrorBoundaryProps {
    [key: string]: any;
}

interface IState {
    hasError: boolean;
    error: string;
    [key: string]: any;
}

export class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IState> {
    constructor(public props: IErrorBoundaryProps) {
        super(props);

        this.state = { 
            hasError: false,
            error: '' 
        };
    }

    static getDerivedStateFromError(error: ErrorInfo) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState({
            hasError: true
        });
    }

    public render() {
        const { hasError, error } = this.state;
        const { children } = this.props;
        if (hasError) {
            return <div className='react-error-boundary'>
                <p>{String(error)}</p>
            </div>;
        }

        return children;
    }
}
