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
    [key: string]: any;
}

export interface ITeachChapterList {
    chapterId: string;
    collectionCount: number;
    createTime: string;
    desc: string;
    downloadCount: number;
    fabulousCount: number;
    fileFormat: number;
    fileName: string;
    fileType: string;
    id: number;
    link: string;
    materialId: string;
    name: string;
    parentId: string;
    pic: string;
    realFileName: string;
    size: string;
    title: string;
    type: string;
    updateTime: string;
    uploadTime: string;
    viewCount: number;
    weight: number;
    isCollect?: boolean;
    isPraise?: boolean;
    [key: string]: any;
}

export interface IChapterResponseDtoListItem {
    section: ISectionItem;
    teachChapterList: ITeachChapterList[];
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
    teacherId?: string;
    type: number;
    confirm?: number;
}

export interface IMaterialOptionResponseResult extends IAjaxCommonResponse {}

/** 教材是否被点赞收藏 请求参数 */
export interface IMaterialStatusRequest {
    teacherId?: string;
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
            idCollectionList: string[];
        };
        success: boolean;
    }
}

/** 收藏列表 请求参数 */
export interface ICollectionListsRequest {
    pageInfo: {
        pageNum: number;
        pageSize: number;
    },
    // teacherId?: string;
}

export interface ITeachChapterResList {
    chapterId: string;
    collectionCount: number;
    createTime: string;
    desc: string;
    downloadCount: number;
    fabulousCount: number;
    fileFormat: number;
    fileName: string;
    fileType: string;
    id: number;
    link: string;
    materialId: string;
    name: string;
    parentId: string;
    pic: string;
    realFileName: string;
    size: string;
    title: string;
    type: string;
    updateTime: string;
    uploadTime: string;
    viewCount: number;
    weight: number;
    coverLink?: string;
    [key: string]: any;
}

/** 收藏列表 返回参数 */
export interface ICollectionListsResponse extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            teachChapterList: {
                hasNextPage: boolean;
                list: ITeachChapterResList[];
                pageNum: number;
                pageSize: number;
                total: number;
            };
        };
        success: boolean;
    }
}

/** 教材搜索 请求参数 */
export interface IMaterialSearchRequest {
    pageInfo:{
        pageNum: number;
        pageSize: number;
    };
    content: string;
    fileFormat: string;
    fileType: string;
}

export interface IMaterialSearchList {
    chapterId: string;
    collectionCount: number;
    createTime: string;
    desc: string;
    downloadCount: number;
    fabulousCount: number;
    fileFormat: number;
    fileName: string;
    fileType: string;
    id: number;
    link: string;
    materialId: string;
    name: string;
    parentId: string;
    pic: string;
    realFileName: string;
    size: string;
    title: string;
    type: string;
    updateTime: string;
    uploadTime: string;
    viewCount: number;
    weight: number;
    teacherLink: string;
    materialName: string;
    chapterName: string;
    [key: string]: any;
}

export interface IMaterialSearchResponse extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            teachMaterialDto: {
                hasNextPage: boolean;
                list: IMaterialSearchList[];
                pageNum: number;
                pageSize: number;
                total: number;
            };
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
            desc: string;
            teacherId: string;
            updateTime: string;
            userName: string;
        };
        success: boolean;
    }
}

/** 更新个人信息请求参数 */
export interface IPersonUpdateRequestParams {
    loginName: string;
    password: string;
    position: string;
    userName: string;
    desc: string;
    [key: string]: any;
}

export interface IPersonUpdateResponseResult extends IAjaxCommonResponse {
}

/** 更新密码 */
export interface IUpdatePasswordRequestParams {
    oldPassword: string;
    newPassword: string;
    againNewPassword: string;
    teacherId?: string;
}

/** 添加资源信息 */
export interface IAddSectionRequest {
    materialId: string;
    /** 选中额chapterID */
    parentId: string;
    teachChapter: {
        desc: string;
        name: string;
        fileFormat: number;
        fileType: number;
        weight: number;
    };
    /** 写死为2 */
    type: 2;
}

export interface IAddSectionResponseResult extends IAjaxCommonResponse {
}

/** 新建教材 */
export interface IAddChapterAllRequest {
    chapterResponseDtoList: IAddChapterAllChapterRequestDtoList[];
    teachMaterial: {
        title: string;
        type: 'Type1'
    }
}

export interface IAddChapterAllRequestResult extends IAjaxCommonResponse {}

export interface IUpdateChapterAllChapterResponseList {
    section: {
        chapterId: string;
        materialId: string;
        name: string;
        parentId: string;
        type: 1;
        weight: number;
    };
    teachChapterList?: Array<{
        chapterId: string;
        materialId: string;
        name: string;
        parentId: string;
        type: 1;
        weight: number;
    }>
}

/** 更新教材 */
export interface IUpdateChapterAllRequest {
    chapterResponseDtoList: IUpdateChapterAllChapterResponseList[];
    teachMaterial: {
        materlId: string;
        desc: string | null;
        pic: string | null;
        contributors: string | null;
        score: string | null;
        size: string | null;
        title: string;
        type: string;
        weight: number | null;
    }
}

export interface IUpdateChapterAllRequestResult extends IAjaxCommonResponse {}

/** 未完成 */
/** 删除教材、节点、文件 */
export interface IDeleteChapterOrSectionRequest {
    id: string;
    type: 10;
}

export interface IDeleteChapterOrSectionResponseResult extends IAjaxCommonResponse {}

export interface IAddChapterAllChapterRequestDtoList {
    section: Array<{
        name: string;
        type: 1,
        weight: number;
    }>,
    teachChapterList?: Array<{
        name: string;
        type: 2;
        weight: number;
    }>
}



/** 未完成 */
/** 上传教学材料附件的接口 应该以formData格式传递 */
export interface IUploadFileRequest {
    chapterId: string;
    materialId: string;
    file: Blob;
}

export interface IUploadFileResponseResult extends IAjaxCommonResponse {}
