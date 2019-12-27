import React from 'react';
import './index.scss';

interface ILoadingProps {
    [key: string]: any;
}

const LoadingComponent: React.FC<ILoadingProps> = props => {
    return (
        <div id="casePourpre">
            <div id="load">
                <p>loading</p>
            </div>
            <div id="vague">
                <div id="vague1"></div>
                <div id="vague2"></div>
                <div id="vague3"></div>
                <div id="vague4"></div>
                <div id="vague5"></div>
                <div id="vague6"></div>
            </div>
        </div>
    )
}

export default LoadingComponent;
