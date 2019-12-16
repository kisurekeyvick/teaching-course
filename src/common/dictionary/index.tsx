import { 
    DOC,
    DOCX,
    XLS,
    XLSX,
    PPT,
    PPTX,
    TIF,
    PDF,
    SWF,
    MPFour
 } from 'common/service/img-collection';

export const dictionary: Map<string, any[]> = new Map([
    /** 资源类型 */
    ['source-type', [
        { name: '练习题', value: '1' },
        { name: '电子教材', value: '2' },
        { name: '课程设计', value: '3' },
        { name: '电子教程', value: '4' }
    ]],
    /** 资源格式 */
    ['source-format', [
        { name: '.doc', value: '1' },
        { name: '.docx', value: '2'},
        { name: '.xls', value: '3' },
        { name: '.xlsx', value: '4' },
        { name: '.ppt', value: '5' },
        { name: '.pptx', value: '6' },
        { name: '.tif', value: '7' },
        { name: '.pdf', value:'8' },
        { name: '.swf', value: '9' },
        { name: '.mp4', value: '10'}
    ]],
    /** 教材操作 */
    ['material-operation', [
        { name: 'download', value: '1' },
        { name: 'see', value: '2' },
        { name: 'praise', value: '3' },
        { name: 'collect', value: '4' }
    ]],
    /** 教材操作 确认/取消 */
    ['material-confirm', [
        { name:'确认(点赞 收藏)', value: '1' },
        { name:'取消(点赞 收藏)', value: '2' },
    ]]
]);

/** 资源格式词典 */
export const sourceFormat: IDictionaryItem[] = [
    { name: '.doc', value: '1', src: DOC },
        { name: '.docx', value: '2', src: DOCX },
        { name: '.xls', value: '3', src: XLS },
        { name: '.xlsx', value: '4', src: XLSX },
        { name: '.ppt', value: '5', src: PPT },
        { name: '.pptx', value: '6', src: PPTX },
        { name: '.tif', value: '7', src: TIF },
        { name: '.pdf', value:'8', src: PDF },
        { name: '.swf', value: '9', src: SWF },
        { name: '.mp4', value: '10', src: MPFour }
];

export interface IDictionaryItem {
    name: string;
    value: number | string;
    src?: any;
};

export const findTarget = (source: IDictionaryItem[], value: number | string) => {
    return source.find((i: IDictionaryItem) => i.value === value);
};
