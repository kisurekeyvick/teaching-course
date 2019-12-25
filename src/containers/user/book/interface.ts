export interface ICommon {
    [key: string]: any;
}

export interface IDirectoryProps {
    callBack: Function;
    history: any;
    [key: string]: any;
}

export interface IRecommendProps {
    callBack?: Function;
    [key: string]: any;
}

export interface ILatestUploadProps {
    history: any;
    [key: string]: any;
}

export interface IBookListItemDetailProps {
    history: any;
    [key: string]: any;
}

export interface IBookListProps {
    searchBook: string;
    history: any;
    showList: any[];
    isLoading: string;
    breadcrumb: string[];
    updateTime: number;
    [key: string]: any;
}
