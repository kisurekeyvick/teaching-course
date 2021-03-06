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

export interface IQueryPersonDataResult {
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
    [key: string]: any;
}

/** 查询个人信息返回参数 */
export interface IQueryPersonResponse extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: IQueryPersonDataResult;
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

export interface IAddSectionResponseResultDataResult {
    id: number;
    chapterId: string;
    materialId: string;
    parentId: string;
    type: number;
    fileFormat: string;
    fileType: string;
    name: string;
    desc: string;
    size: string;
    realFileName: string;
    fileName: string;
    coverLink: string;
    teacherId: string;
    link: string;
    fabulousCount: number;
    viewCount: number;
    collectionCount: number;
    downloadCount: number;
    weight: number;
    uploadTime: string;
    createTime: string;
    updateTime: string;
}

export interface IAddSectionResponseResult extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: IAddSectionResponseResultDataResult;
        success: boolean;
    },
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

/** 删除教材、节点、文件 */
export interface IDeleteChapterOrSectionRequest {
    id: string;
    /** type 1  删除章，  type 2 删除文件 ， type 15 删除课程 */
    type: 15 | 2 | 1;
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


export interface IUpdateTeacherFileResponseResult extends IAjaxCommonResponse {}


/** 上传教学材料附件的接口 应该以formData格式传递 */
export interface IUploadFileRequest {
    chapterId: string;
    materialId: string;
    file: Blob;
}

export interface IUploadFileResponseResult extends IAjaxCommonResponse {}

export interface IUpdateResourcesRequest extends ITeachChapterResList {

}

export interface IUpdateResourcesResponseResult extends IAjaxCommonResponse {}

export interface IQueryTeachChapterListRes {
    hasNextPage: boolean;
    list: IQueryPersonDataResult[];
    pageNum: number;
    pageSize: number;
    total: number;
}

/** 教师列表查询返回结果 */
export interface IQueryPersonListResponseResult extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: {
            teachChapterList: IQueryTeachChapterListRes;
        };
        success: boolean;
    },
}

export interface IQueryPersonListRequestParams {
    pageInfo?:{
        pageNum: number;
        pageSize: number;
    };
}

/** 用户注册请求参数 */
export interface IUserRegisterRequestParams {
    loginName: string;
    password: string;
}

export interface IAccountInfo extends IQueryPersonDataResult {
    id: number;
    teacherId: string;
    [key: string]: any;
}

/** 用户注册完成返回结果 */
export interface IUserRegisterResponseResult extends IAjaxCommonResponse {
    data: {
        desc: string;
        isAdministrators: number;
        result: IAccountInfo;
        success: boolean;
    }
}

/** 删除用户请求参数 */
export interface IDeleteUserRequestParams {
    teacherId: string;
}

export interface IDeleteUserResponseResult extends IAjaxCommonResponse {}
