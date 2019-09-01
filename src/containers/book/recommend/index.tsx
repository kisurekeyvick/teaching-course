import * as React from 'react';
import { IRecommendProps } from '../interface';
import './index.scss';

export default class RecommendContainer extends React.PureComponent<IRecommendProps, any> {
    constructor(public props: IRecommendProps) {
        super(props);
    }

    public render() {
        return <div className='recommend-box'>
                    <div className='recommend-title'>
                        <p>特别推荐</p>
                    </div>
                </div>
    }
}
