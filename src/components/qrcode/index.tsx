import * as React from 'react';
import QRCode from 'qrcode.react';

export interface IQrcodeComponentProps {
    className?: string;
    url: string;
}

const QrcodeComponent: React.FC<IQrcodeComponentProps> = props => {
    return (
        <QRCode value={props.url} />
    )
}

export default QrcodeComponent;
