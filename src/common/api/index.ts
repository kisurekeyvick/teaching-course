import axios from 'axios';
import { httpRequest } from '../http/index';
import './_mock';

export const api = {
    mockUpload: (param?: any) => {
        return new Promise((resolve: any, reject: any) => {
            axios.post('/api/upload', {}).then(res => {
                resolve(res);
            }, error => {
                reject(error);
            });
        });
    },
    login: httpRequest(`POST /project/login`),
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