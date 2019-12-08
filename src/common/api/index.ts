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
    }
};