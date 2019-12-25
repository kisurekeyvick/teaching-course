import React from 'react';
import { Modal, Button } from 'antd';
// import { dictionary, IDictionaryItem } from 'common/dictionary/index';
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

interface IState {
    [key: string]: any;
}

/** 资源格式 */
// const sourceFormat: IDictionaryItem[] = [...dictionary.get('source-format')!];

export const BrowseFileModalComponent: React.FC<IBrowseFileModalProps> = props => {
    const { title, handleOkCallBack, handleCancelCallBack, footer, source, modalVisible } = props;

    const fileFormat: string = String(source.fileFormat);

    /** 资源的类型如果是10(视频)，那么就显示半屏幕，否则显示全屏 */
    const layout = fileFormat === '10' ? {
        
    } : { width: '100%', style: { top: 0, height: '100%' } };

    /** 其他配置 */
    const otherConfig = {
        ...layout
    };

    function handleOk() {
        handleOkCallBack();
    }

    function handleCancel() {
        handleCancelCallBack();
    }

    const src: string = `${env.browseFileUrl}${encodeURIComponent(source.url)}`;

    return (
        <div className='browse-file-modal-box'>
            <Modal
                className={`browse-file-modal ${fileFormat === '10' ? 'video-box' : 'common-box'}`}
                title={title}
                onOk={handleOk}
                onCancel={handleCancel}
                {...otherConfig}
                visible={modalVisible}
                maskClosable={false}
                footer={[
                    <Button key='cancel' onClick={handleOk}>
                        { footer ? footer.left : '取消' }
                    </Button>,
                    <Button key='sure' type='primary' onClick={handleCancel}>
                        { footer ? footer.right : '确认' }
                    </Button>
                ]}>
                    <div className={fileFormat === '10' ? 'video-box' : 'common-box'}>
                        <iframe title='view-iframe' name='previewframe' id='previewframe' width='100%'
                            height='100%'
                            src={src}/>
                    </div>
            </Modal>
        </div>
    )
};
