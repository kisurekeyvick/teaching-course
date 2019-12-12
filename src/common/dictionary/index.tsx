export const dictionary = new Map([
    /** 资源类型 */
    ['source-type', [
        { name: '练习题', value: '1' },
        { name: '电子教材', value: '2' },
        { name: '课程设计', value: '3' },
        { name: '电子教程', value: '4' }
    ]],
    /** 资源格式 */
    ['source-format', [
        { name: 'PPT', value: '1' },
        { name: 'DOC/DOSC', value: '2' },
        { name: 'TXT', value: '3' },
        { name: 'XLS', value: '4' },
        { name: '视频', value: '5' },
        { name: '音频', value: '6' },
        { name: '图片', value: '7' },
        { name: 'PSD', value:'8' },
        { name: 'ZIP', value: '9' },
        { name: '其他', value: '10' }
    ]]
]);

export interface IDictionaryItem {
    name: string;
    value: number | string;
    src?: string;
};

export const findTarget = (source: IDictionaryItem[], value: number | string) => {
    return source.find((i: IDictionaryItem) => i.value === value);
};
