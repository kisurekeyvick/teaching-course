import { dictionary, IDictionaryItem } from 'common/dictionary/index';

export interface IFormItem {
    label: string;
    key: string;
    rules?: any[];
    placeholder?: string;
    controlName: string;
    controlType?: string;
    source?: IDictionaryItem[];
    state: string;
}

export interface IBtnGroupOptions {
    name: string;
    key: string;
    value: string;
    selected: boolean;
}

export const sourceFormat = dictionary.get('source-format')!;
export const sourceType = dictionary.get('source-type')!

export const formItems: IFormItem[] = [
    {
        label: '教材上传节点',
        key: '1',
        controlName: 'button',
        controlType: 'tree',
        state: 'location',
    },
    {
        label: '标题',
        placeholder: '请输入标题',
        key: '3',
        rules: [
            {
                required: true,
                message: '请输入标题',
            }
        ],
        state: 'name',
        controlName: 'input',
        controlType: 'text'
    },
    {
        label: '描述',
        placeholder: '请输入描述',
        key: '4',
        controlName: 'input',
        controlType: 'textarea',
        state: 'desc'
    },
    {
        label: '资源格式',
        key: '5',
        controlName: 'select',
        source: sourceFormat,
        state: 'sourceFormat'
    }, 
    {
        label: '资源类型',
        key: '6',
        controlName: 'select',
        source: sourceType,
        state: 'sourceType'
    }
];

export interface IFormValue {
    desc: string;
    name: string;
    fileFormat: string;
    fileType: string;
}

export const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
};

export const submitFormItemLayout = {
    wrapperCol: {
        sm: { span: 24 }
    }
};
