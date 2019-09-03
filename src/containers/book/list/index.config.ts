import picture from 'assets/images/timg.jpg';
import noData from 'assets/images/noData.png';

export const imgList: any = {
    picture,
    noData
};

export interface IFilterConfigItem {
    name?: string;
    value: string;
    selected?: boolean;
    label?: string;
    order?: string;
    [key: string]: any;
}

interface IFilterConfig {
    type: IFilterConfigItem[];
    format: IFilterConfigItem[];
    sort: IFilterConfigItem[];
}

export const filterConfig: IFilterConfig = {
    type: [
        { name: '全部', value: '0', selected: false },
        { name: '微课', value: '1', selected: false },
        { name: '电子教材', value: '2', selected: false },
        { name: '教学设计', value: '3', selected: false },
    ],
    format: [
        { label: '全部', value: 'all' },
        { label: '文档', value: 'document' },
        { label: '图片', value: 'pic' },
        { label: '音频', value: 'audeo' },
        { label: '视频', value: 'video' },
        { label: '动画', value: 'cartoon' },
        { label: '其他', value: 'other' },
    ],
    sort: [
        { name: '默认', value: 'default', selected: false, order: 'down' },
        { name: '时间', value: 'time', selected: false },
        { name: '下载', value: 'download', selected: false },
        { name: '评分', value: 'score', selected: false }
    ]
};

export const booklist = [
    {
        title: '一去二三里-资源包',
        rate: 4.2,
        pic: picture,
        desc: '本资源为《一去二三里》的资源包，包含本科的教学设计，可见，习题，素材类型的推荐资源',
        createTime: '2019年09月02日',
        size: '11.59MB',
        viewCount: '24085',
        downloadCount: '63708',
        contributors: 'nice fish',
        currentCount: '319',
        type: 'zip',
        qrcode: 'https://juejin.im',
        id: 1
    },
    {
        title: '人教-上语文《四季》课件',
        rate: 4.4,
        pic: picture,
        desc: '本资源为《一去二三里》的资源包，包含本科的教学设计，可见，习题，素材类型的推荐资源',
        createTime: '2019年09月02日',
        size: '11.59MB',
        viewCount: '24085',
        downloadCount: '63708',
        contributors: 'nice fish',
        currentCount: '119',
        type: 'ppt',
        qrcode: 'https://juejin.im',
        id: 2
    },
    {
        title: '哪座房子最漂亮',
        rate: 4.6,
        pic: picture,
        desc: '',
        createTime: '2019年09月02日',
        size: '63.5KB',
        viewCount: '24085',
        downloadCount: '63708',
        contributors: 'nice fish',
        currentCount: '219',
        type: 'doc',
        qrcode: 'https://juejin.im',
        id: 3
    },
];
