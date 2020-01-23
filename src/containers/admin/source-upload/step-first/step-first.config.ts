import { dictionary, IDictionaryItem } from 'common/dictionary/index';

export interface IFormItem {
    label: string;
    key: string;
    rules?: any[];
    placeholder?: string;
    controlName: string;
    controlType?: string;
    source?: IDictionaryItem[];
    maxLength?: number;
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
        label: '资源上传节点',
        key: '1',
        controlName: 'button',
        controlType: 'tree',
        state: 'location',
    },
    {
        label: '资源标题',
        placeholder: '请输入资源标题',
        key: '3',
        rules: [
            {
                required: true,
                message: '请输入标题',
            }
        ],
        state: 'name',
        controlName: 'input',
        controlType: 'text',
        maxLength: 100
    },
    {
        label: '教学目标(非必填)',
        placeholder: '请输入教学目标或资源相关描述(不超过200字)',
        key: '4',
        controlName: 'input',
        controlType: 'textarea',
        maxLength: 200,
        state: 'desc'
    },
    {
        label: '资源格式',
        key: '5',
        rules: [
            {
                required: true,
                message: '请选择资源格式',
            }
        ],
        controlName: 'select',
        source: sourceFormat,
        state: 'sourceFormat'
    }, 
    {
        label: '资源类型',
        key: '6',
        rules: [
            {
                required: true,
                message: '请选择资源类型',
            }
        ],
        controlName: 'select',
        source: sourceType,
        state: 'sourceType'
    }
];

export interface IFormValue {
    desc: string;
    name: string;
    sourceFormat: string;
    sourceType: string;
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

export interface ITeachChapter {
    desc: string;
    name: string;
    fileFormat: number;
    fileType: number;
    weight: number;
}

export const submitFormItemLayout = {
    wrapperCol: {
        sm: { span: 24 }
    }
};
