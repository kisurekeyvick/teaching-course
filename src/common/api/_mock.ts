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

export const mockCourseDirectory_api = Mock.mock('/api/courseDirectory', 'post', () => {
    return [
        {
            name: '第一章，城规交通',
            key: '1',
            children: [
                {
                    name: '第一章，第1节',
                    key: '11',
                },
                {
                    name: '第一章，第2节',
                    key: '12',
                },
                {
                    name: '第一章，第3节',
                    key: '13',
                },
                {
                    name: '第一章，第4节',
                    key: '14',
                }
            ]
        },
        {
            name: '第二章，城规交通',
            key: '2',
            children: [
                {
                    name: '第二章，第1节',
                    key: '21',
                },
                {
                    name: '第二章，第2节',
                    key: '22',
                },
                {
                    name: '第二章，第3节',
                    key: '23',
                },
                {
                    name: '第二章，第4节',
                    key: '24',
                }
            ]
        },
        {
            name: '第三章，城规交通',
            key: '3',
            children: [
                {
                    name: '第三章，第1节',
                    key: '31',
                },
                {
                    name: '第三章，第2节',
                    key: '32',
                },
                {
                    name: '第三章，第3节',
                    key: '33',
                },
                {
                    name: '第三章，第4节',
                    key: '34',
                }
            ]
        },
        {
            name: '第四章，城规交通',
            key: '4',
            children: [
                {
                    name: '第四章，第1节',
                    key: '41',
                },
                {
                    name: '第四章，第2节',
                    key: '42',
                },
                {
                    name: '第四章，第3节',
                    key: '43',
                },
                {
                    name: '第四章，第4节',
                    key: '44',
                }
            ]
        },
        {
            name: '第五章，城规交通',
            key: '5',
            children: [
                {
                    name: '第四章，第1节',
                    key: '51',
                },
                {
                    name: '第四章，第2节',
                    key: '52',
                },
                {
                    name: '第四章，第3节',
                    key: '53',
                },
                {
                    name: '第四章，第4节',
                    key: '54',
                }
            ]
        },
        {
            name: '第六章，城规交通',
            key: '6',
            children: [
                {
                    name: '第四章，第1节',
                    key: '61',
                },
                {
                    name: '第四章，第2节',
                    key: '62',
                },
                {
                    name: '第四章，第3节',
                    key: '63',
                },
                {
                    name: '第四章，第4节',
                    key: '64',
                }
            ]
        }
    ];
});

export const mockSearchResult_api = Mock.mock('/api/searchResult', 'post', () => {
    return [
        {
            title: '城市轨道交通车辆',
            desc: '段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台',
            id: 1,
            createTime: '2017-10-01 18:00',
            contributors: '林东东',
            directory: '系统概论>第一课>第一讲',
            userImg: ''
        },
        {
            title: '城市轨道交通车辆',
            desc: '段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台',
            id: 2,
            createTime: '2017-10-01 18:00',
            contributors: '林东东',
            directory: '系统概论>第一课>第一讲',
            userImg: ''
        },
        {
            title: '城市轨道交通车辆',
            desc: '段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台',
            id: 3,
            createTime: '2017-10-01 18:00',
            contributors: '林东东',
            directory: '系统概论>第一课>第一讲',
            userImg: ''
        },
        {
            title: '城市轨道交通车辆',
            desc: '段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台',
            id: 4,
            createTime: '2017-10-01 18:00',
            contributors: '林东东',
            directory: '系统概论>第一课>第一讲',
            userImg: ''
        },
        {
            title: '城市轨道交通车辆',
            desc: '段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台,段落示意：蚂蚁金服设计平台',
            id: 5,
            createTime: '2017-10-01 18:00',
            contributors: '林东东',
            directory: '系统概论>第一课>第一讲',
            userImg: ''
        }
    ]
});