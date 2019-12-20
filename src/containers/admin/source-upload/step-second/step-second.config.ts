export interface IFormItem {
    label: string;
    key: string;
    rules?: any[];
    placeholder?: string;
    controlName: string;
    controlType?: string;
    state: string;
}

export const formItems: IFormItem[] = [
    {
        label: '教材封面上传',
        key: '1',
        controlName: 'upload',
        controlType: 'upload',
        state: 'overLinkFile',
    },
    {
        label: '教材上传',
        key: '2',
        controlName: 'upload',
        controlType: 'upload',
        state: 'materialFile',
    }
];
