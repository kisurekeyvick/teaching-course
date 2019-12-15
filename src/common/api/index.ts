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
    /** 查询个人信息 */
    queryPerson: httpRequest(`POST /teacher/queryPerson`),
    /** 上传文件 */
    uploadFile: httpRequest(`POST /material/uploadFile`),
    /** 下载文件 */
    download: httpRequest(`GET /material/download`),
    /** 更新个人信息 */
    updateTeacher: httpRequest(`POST /teacher/update`),
    

    loadTeachingMenu: () => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/teachingMenu', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadCourseDirectory: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/courseDirectory', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadSearchResult: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/searchResult', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadSourceManageResult: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/sourceManageResult', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadCollectionResult: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/collection', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadTeachingMaterialDirectory: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/directory', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadSectionDirectory: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/section', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    loadBookList: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/booklist', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
};