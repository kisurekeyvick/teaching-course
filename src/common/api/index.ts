import axios from 'axios';
import { httpRequest } from '../http/index';
import './_mock';

export const api = {
    /** 前端mock上传进度 */
    mockUpload: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/upload', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    /** 用户登录 */
    login: httpRequest(`POST /teacher/login`),
    /** 用户退出 */
    signOut: httpRequest(`POST /teacher/signOut`),
    /** 教材列表 */
    materialList: httpRequest(`POST /material/list`),
    /** 教材章节 */
    sectionList: httpRequest(`POST /material/section`),
    /** 收藏，阅读，点赞 */
    materialOption: httpRequest(`POST /material/option`),
    /** 查看教材是否被点赞和收藏 */
    materialStatus: httpRequest(`POST /material/isCollection`),
    /** 收藏列表 */
    collectionList: httpRequest(`POST /material/collectionList`),
    /** 检索教材 */
    materialSearch: httpRequest(`POST /material/search`),
    /** 查询个人信息 */
    queryPerson: httpRequest(`POST /teacher/queryPerson`),
    /** 更新密码 */
    updatePassword: httpRequest(`POST /teacher/updatePassword`),
    /** 更新个人信息 */
    updateTeacher: httpRequest(`POST /teacher/update`),
    /** 新建资源接口 */
    addSection: httpRequest(`POST /material/addSection`),
    /** 新建教材全集 */
    addChapterAll: httpRequest(`POST /material/addChapterAll`),
    /** 更新教材全集 */
    updateChapterAll: httpRequest(`POST /material/updateChapter`),
    /** 删除教材/节点/删除文件 */
    deleteChapterOrSection: httpRequest(`POST /material/deleteChapterOrSection`),
    /** 上传文件 */
    uploadFile: httpRequest(`POST /material/uploadFile`),
    /** 修改封面信息 */
    updateCoverFile: httpRequest(`POST /material/updateCoverFile`),
    /** 上传用户头像 */
    updateTeacherFile: httpRequest(`POST /material/updateTeacherFile`),
    /** 下载文件 */
    download: httpRequest(`GET /material/download`),
    /** 更新章节资源信息 */
    updateResources: httpRequest(`POST /material/updateResources`),

    /** 查询个人信息列表 */
    queryPersonList: httpRequest(`POST /teacher/queryPersonList`),
    
    /** mock */
    loadSourceManageResult: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/sourceManageResult', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    }
};