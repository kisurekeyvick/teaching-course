export interface IFormItem {
    label: string;
    key: string;
    rules?: any[];
    placeholder?: string;
    controlName: string;
    controlType?: string;
    state: string;
}

export interface IBtnGroupOptions {
    name: string;
    key: string;
    value: string;
    selected: boolean;
}

export const formItems: IFormItem[] = [
    {
        label: '教材上传',
        key: '1',
        controlName: 'upload',
        controlType: 'upload',
        state: 'fileList',
    },
    {
        label: '标题',
        placeholder: '请输入标题',
        key: '2',
        rules: [
            {
                required: true,
                message: '请输入标题',
            }
        ],
        state: 'title',
        controlName: 'input',
        controlType: 'text'
    },
    {
        label: '描述',
        placeholder: '请输入描述',
        key: '3',
        controlName: 'input',
        controlType: 'textarea',
        state: 'desc'
    },
    {
        label: '分类',
        key: '4',
        controlName: 'btn-group',
        state: 'type'
    }
];

export const typeOptions: IBtnGroupOptions[] = [
    { name: 'PPT', key: '1', value: '', selected: false},
    { name: 'DOC/DOSC', key: '2', value: '', selected: false },
    { name: 'TXT', key: '3', value: '', selected: false },
    { name: 'XLS', key: '4', value: '', selected: false },
    { name: '视频', key: '5', value: '', selected: false },
    { name: '音频', key: '6', value: '', selected: false },
    { name: '图片', key: '7', value: '', selected: false },
    { name: 'PSD', key:'8', value: '', selected: false },
    { name: 'ZIP', key: '9', value: '', selected: false },
    { name: '其他', key: '10', value: '', selected: false }
];
