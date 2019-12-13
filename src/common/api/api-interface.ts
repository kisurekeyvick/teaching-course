/** 教材目录返回数据格式 */
export interface ITeachDirectoryMaterialList {
    contributors: string;
    desc: string;
    id: number;
    materlId: string;
    pic: string;
    score: string;
    size: string;
    title: string;
    type: string;
    weight: number;
}

export interface ISection {
    name: string;
    type: number;
    weight: number;
    id: number;
}

export interface ITeachDirectoryResponse {
    desc: string;
    isAdministrators: number;
    result: {
        teachMaterialList: ITeachDirectoryMaterialList[]
    }
}

/** 课程资源列表 */
/** 请求格式 */
export interface ICourseMaterialListRequest {
    content?: string;
    startDate?: string;
    endDate?: string;
    pageNum: number;
    pageSize: number;
}

export interface ICourseMaterialDto {
    contributors: string;
    desc: string;
    id: number;
    materlId: string;
    pic: string;
    score: string;
    size: string;
    title: string;
    type: string;
    updateTime: string;
    weight: number;
    [key: string]: any;
}

/** 返回格式 */
export interface ICourseMaterialListResponse {
    desc: string;
    isAdministrators: number;
    result: {
        teachMaterialDto: {
            list: ICourseMaterialDto[];
        },
        total: number;
        pageNum: number;
        pageSize: number;
        pages: number;
        isLastPage: boolean;
        [key: string]: any;
    },
    success: boolean;
}