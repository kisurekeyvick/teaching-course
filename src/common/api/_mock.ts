import * as Mock from 'mockjs';

/** 设置mock延迟时间 */
Mock.setup({timeout: '1000-2500'});

export const mockUpload_api = Mock.mock('/api/upload', 'post', () => {
    return {};
});

export const mockTeachingMenu_api = Mock.mock('/api/teachingMenu', 'post', () => {
    return [
        { 
            name: '目录',
            key: '1',
            value: 'one',
            children: []
        },
        {
            name: '入学教育',
            key: '2',
            value: 'two',
            children: [],
        },
        {
            name: '识字(一)',
            key: '3',
            value: 'three',
            children: [
                {
                    name: '一去二三里',
                    key: '31',
                    value: 'three-one',
                    children: []
                },
                {
                    name: '口耳目',
                    key: '32',
                    value: 'three-two',
                    children: []
                },
                {
                    name: '在家里',
                    key: '33',
                    value: 'three-three',
                    children: []
                }
            ]
        },
        {
            name: '课程(一)',
            key: '4',
            value: 'four',
            children: [
                {
                    name: '画',
                    key: '41',
                    value: 'four-one',
                    children: []
                },
                {
                    name: '四季',
                    key: '42',
                    value: 'four-two',
                    children: []
                }
            ]
        }
    ]
});