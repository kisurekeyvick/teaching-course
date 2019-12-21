import * as Mock from 'mockjs';

/** 设置mock延迟时间 */
Mock.setup({timeout: '1000-2500'});

export const mockUpload_api = Mock.mock('/api/upload', 'post', () => {
    return {};
});

export const mockSourceManageResult_api = Mock.mock('/api/sourceManageResult', 'post', () => {
    return [
        {
            id: 1,
            type: '1',
            name: '城市轨道交通运营1',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
        {
            id: 2,
            type: '2',
            name: '城市轨道交通运营2',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
        {
            id: 3,
            type: '3',
            name: '城市轨道交通运营3',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
        {
            id: 4,
            type: '4',
            name: '城市轨道交通运营4',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
        {
            id: 5,
            type: '2',
            name: '城市轨道交通运营5',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
        {
            id: 6,
            type: '3',
            name: '城市轨道交通运营6',
            creater: 'admin',
            desc: '这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，这是一个简介，'
        },
    ]
});
