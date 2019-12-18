export interface IDataSource {
    size: string;
    title: string;
    desc: string;
    url: string;
    type: string;
    typeImg: any;
    id: number;
    isCollect: boolean;
    chapterId: string;
    fileFormat: number;
    [key: string]: any;
} 