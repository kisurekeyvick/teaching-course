import React from 'react';
import { Modal, Button } from 'antd';
import { env } from 'environment/index';
import './browse-file.scss';

export interface IBrowseFileModalProps {
    title: string;
    handleOkCallBack: Function;
    handleCancelCallBack: Function;
    modalVisible: boolean;
    footer?: {
        left: string;
        right: string;
    },
    style?: any;
    source: any;
    [key: string]: any;
}

export const BrowseFileModalComponent: React.FC<IBrowseFileModalProps> = props => {
    const { title, handleOkCallBack, footer, source, modalVisible } = props;

    const fileFormat: string = String(source.fileFormat);

    /** 资源的类型如果是10(视频)，那么就显示半屏幕，否则显示全屏 */
    const layout = { width: '100%', style: { top: 0, height: '100%' } };

    /** 其他配置 */
    const otherConfig = {
        ...layout
    };

    function handleOk() {
        handleOkCallBack();
    }

    const src: string = ((): string => {
        let innerUrl: string = '';

        if (fileFormat === '1' ||
            fileFormat === '2' ||
            fileFormat === '3' ||
            fileFormat === '4' ||
            fileFormat === '5' ||
            fileFormat === '6') {
            /** 适用于： .doc .docx .xls .xlsx .ppt .pptx */
            innerUrl = env.officeFileUrl;
        } else if (fileFormat === '8') {
            innerUrl = env.pdfFileUrl;
        } else {
            /** jpg，jpeg，png，gif，tif, zip,rar,jar,tar,gzip, mp3,wav,mp4,flv */
            innerUrl = env.otherFileUrl;
        }

        return `${innerUrl}${encodeURIComponent(source.url)}`;
    })();

    return (
        <div className='browse-file-modal-box'>
            <Modal
                className={`browse-file-modal common-box`}
                title={title}
                onOk={handleOk}
                onCancel={handleOk}
                {...otherConfig}
                visible={modalVisible}
                maskClosable={false}
                footer={[
                    <Button key='cancel' onClick={handleOk}>
                        { footer ? footer.left : '关闭' }
                    </Button>
                ]}>
                    <div className={'common-box'}>
                        <iframe title='view-iframe' name='previewframe' id='previewframe' width='100%'
                            height='100%'
                            src={src}/>
                    </div>
            </Modal>
        </div>
    )
};
