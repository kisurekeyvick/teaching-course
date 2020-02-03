export interface IDataSource {
    name: string;
    value: string;
    key: string;
};

export const dataSource: IDataSource[] = [
    { name:'系统名称', value: '', key: '1' },
    { name:'服务端软件版本', value: '', key: '2' },
    { name:'发布日期', value: '', key: '3' },
    { name:'前端软件版本', value: '', key: '4' },
    { name:'发布日期', value: '', key: '5' },
    { name:'服务器域名', value: '', key: '6' },
    { name:'服务器当前时间', value: '', key: '7' },
    { name:'服务器已运行时间', value: '', key: '8' },
    { name:'CPU型号[2核]', value: '', key: '9' },
    { name:'服务器主机名', value: '', key: '10' },
    { name:'服务器操作系统', value: '', key: '11' },
    { name:'服务器总空间', value: '', key: '12' },
    { name:'服务器可用空间', value: '', key: '13' },
    { name:'物理内存', value: '', key: '14' },
    { name:'内存已用', value: '', key: '15' },
];