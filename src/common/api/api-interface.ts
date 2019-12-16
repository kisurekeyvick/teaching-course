/** 通用接口 */
export interface IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: any;
        success: boolean;
    },
    status: number;
    statusText: number;
}

/** 登录接口 返回格式 */
export interface ILogin extends IAjaxCommonResponse {
    [key: string]: any;
}

/** 用户退出请求参数 */
export interface ISignOutRequestParams {
    teacherId: string;
}

/** 用户退出返回结果数据 */
export interface ISignOutResponseResult extends IAjaxCommonResponse {
    [key: string]: any;
}

/** 教材列表接口返回结果数据 */
export interface IMaterialListResponseResult extends IAjaxCommonResponse {
    [key: string]: any;
}

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

/** 章节接口请求数据格式 */
export interface IMaterialSectionRequestParams {
    id: string;
}

/** 章节的信息 */
export interface ISectionItem {
    chapterId: string;
    collectionCount: number;
    createTime: string;
    desc: string;
    downloadCount: number;
    fabulousCount: number;
    fileName: string;
    fileType: string;
    id: number;
    link: string;
    materialId: string;
    name: string;
    parentId: string;
    realFileName: string;
    size: string;
    type: number;
    updateTime: string;
    uploadTime: string;
    viewCount: number;
    weight: number;
}

export interface IChapterResponseDtoListItem {
    section: ISectionItem;
    teachChapterList: any[];
}

/** 章节接口数据返回格式 */
export interface IMaterialSectionResponseResult extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            chapterResponseDtoList: Array<IChapterResponseDtoListItem>
        };
        success: boolean;
    }
}

/** 收藏 阅读 点赞 请求格式*/
export interface IMaterialOptionRequest {
    id: string;
    teacherId: string;
    type: number;
    confirm?: number;
}

export interface IMaterialOptionResponseResult extends IAjaxCommonResponse {}

/** 教材是否被点赞收藏 请求参数 */
export interface IMaterialStatusRequest {
    teacherId: string;
    /** 材料 eachChapterList chapterId */
    idList: string[];
}

/** 教材是否被点赞收藏 返回结果 */
export interface IMaterialStatusResponse extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            idList: string[];
            isCollectionList: string[];
        };
        success: boolean;
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

/** 查询个人信息请求参数 */
export interface IQueryPersonParams {
    /** 老师的id */
    id: string;
}

/** 查询个人信息返回参数 */
export interface IQueryPersonResponse extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            age: number;
            createTime: string;
            email: string;
            flag: string;
            id: number;
            isAdministrators: boolean;
            link: string;
            loginName: string;
            password: string;
            phone: number;
            position: string;
            sex: string;
            teacherId: string;
            updateTime: string;
            userName: string;
        };
        success: boolean;
    }
}

/** 更新个人信息千秋参数 */
export interface IPersonUpdateRequestParams {
    loginName: string;
    password: string;
    [key: string]: any;
}

export interface IPersonUpdateResponseResult extends IAjaxCommonResponse {
}

/** 更新密码 */
export interface IUpdatePasswordRequestParams {
    oldPassword: string;
    newPassword: string;
    againNewPassword: string;
    teacherId: string;
}