// import picture from 'assets/images/timg.jpg';
import noData from 'assets/images/noData.png';
import { dictionary } from 'common/dictionary/index';

export const imgList: any = {
    // picture,
    noData
};

export interface IFilterConfigItem {
    name?: string;
    value: string | number;
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

/** 资源类型 */
let sourceType: IFilterConfigItem[] = [...(dictionary.get('source-type')!)];
sourceType.unshift({ name: '全部', value: '' });
sourceType = sourceType.map((item: IFilterConfigItem) => {
    return {
        ...item,
        value: String(item.value),
        selected: item.value === '' ? true : false
    };
});

let sourceFormat: IFilterConfigItem[] = [...(dictionary.get('source-format')!)];
sourceFormat.unshift({ name: '全部', value: '' });
sourceFormat = sourceFormat.map((item: IFilterConfigItem) => {
    return {
        ...item,
        label: item.name,
        value: String(item.value),
        selected: false
    };
});

export const filterConfig: IFilterConfig = {
    type: [...sourceType],
    format: [...sourceFormat],
    sort: [
        { name: '默认', value: 'default', selected: true },
        { name: '时间', value: 'time', selected: false, order: 'down' },
        { name: '下载', value: 'download', selected: false, order: 'down' }
    ]
};

export interface IRequestParams {
}

export interface IResponseData {

}
