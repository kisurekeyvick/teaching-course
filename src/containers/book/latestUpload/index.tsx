import * as React from 'react';
import './index.scss';
import { ILatestUploadProps } from '../interface';

export default class LatestUploadContainer extends React.PureComponent<ILatestUploadProps, any> {
    constructor(public props: ILatestUploadProps) {
        super(props);
    }

    public render() {
        return <div className='latestUpload-box'>
                    <div className='latestUpload-title'>
                        <p>最新上传</p>
                    </div>
                </div>
    }
}
