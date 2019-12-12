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

export interface IRequestParams {
}

export interface IResponseData {

}
