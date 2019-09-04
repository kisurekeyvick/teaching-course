import * as React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export interface ITransitionComponentProps {
    timeout: number;    // 执行动画时间
    classNames: string;
    in: boolean;
    [key: string]: any;
}

export const TransitionComponent: React.FC<ITransitionComponentProps> = props => {
    return <TransitionGroup>
                <CSSTransition
                        in={props.in}
                        timeout={props.timeout}
                        classNames={props.classNames}>
                    {
                        props.children
                    }
                </CSSTransition>
            </TransitionGroup>
}
