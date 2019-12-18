import * as Mock from 'mockjs';

/** 设置mock延迟时间 */
Mock.setup({timeout: '1000-2500'});

export const mockUpload_api = Mock.mock('/api/upload', 'post', () => {
    return {};
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

export const mockDirectoryResult_api = Mock.mock('/api/directory', 'post', () => {
    return {
        'desc': '查询成功',
        'isAdministrators': 0,
        'result': {
          'teachMaterialList': [
                {
                'contributors': 'yangheng',
                'desc': '语文',
                'id': 2,
                'materlId': 'MATERL201912102307538478638',
                'pic': 'C://test',
                'score': '10',
                'size': '100K',
                'title': '语文书',
                'type': 'Type1',
                'weight': 105
                },
                {
                'contributors': 'yangheng',
                'desc': '数学',
                'id': 4,
                'materlId': 'MATERL201912102335181864896',
                'pic': 'C://test',
                'score': '10',
                'size': '100K',
                'title': '数学书',
                'type': 'Type1',
                'weight': 101
                },
                {
                    'contributors': 'yangheng',
                    'desc': '英语',
                    'id': 5,
                    'materlId': 'MATERL201912102335181864896',
                    'pic': 'C://test',
                    'score': '10',
                    'size': '100K',
                    'title': '英语书',
                    'type': 'Type1',
                    'weight': 101
                },
                {
                    'contributors': 'yangheng',
                    'desc': '化学',
                    'id': 6,
                    'materlId': 'MATERL201912102335181864896',
                    'pic': 'C://test',
                    'score': '10',
                    'size': '100K',
                    'title': '化学书',
                    'type': 'Type1',
                    'weight': 103
                },
                {
                    'contributors': 'yangheng',
                    'desc': '物理',
                    'id': 7,
                    'materlId': 'MATERL201912102335181864896',
                    'pic': 'C://test',
                    'score': '10',
                    'size': '100K',
                    'title': '物理书',
                    'type': 'Type1',
                    'weight': 102
                }
            ]
        },
        'success': true
    }
});