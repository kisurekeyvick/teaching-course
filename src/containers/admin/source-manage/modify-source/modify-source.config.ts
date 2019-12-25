import { IDictionaryItem } from 'common/dictionary/index';
import { ITeachChapterList } from 'common/api/api-interface';

export interface IModifySourceProps {
    callBack: Function;
    source: ITeachChapterList;
    updateTime: number;
    [key: string]: any;
}

export interface IFormParams {
    name: string;
    desc: string;
    fileType: string;
    fileFormat: string;
}

export interface IRules {
    title: Array<any>;
    introduction: Array<any>;
    type: Array<any>;
    format: Array<any>;
    name: Array<any>;
    chapter: Array<any>;
    section: Array<any>;
}

export const rules: IRules = {
    title: [{ required: true, message: '请输入标题。' }],
    introduction: [{ required: true, message: '请输入资源简介。' }],
    type: [{ required: true, message: '请选择资源类型。' }],
    format: [{ required: true, message: '请选择资源格式。' }],
    name: [{ required: true, message: '请输入课程。' }],
    chapter: [{ required: true, message: '请输入章节。' }],
    section: [{ required: true, message: '请输入小节。' }]
};

export interface IConfig {
    rules: IRules;
    sourceType: IDictionaryItem[];
    sourceFormat: IDictionaryItem[];
    fileLength: number;
    uploadPicFormat: string[];
}