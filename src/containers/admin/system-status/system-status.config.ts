import { env } from 'environment/index';

export interface IDataSource {
    name: string;
    value: string;
    key: string;
};

export const dataSource: IDataSource[] = [
    { name:'系统名称', value: '厦门信息学校城市轨道交通教学资源管理系统', key: '1' },
    { name:'服务端软件版本', value: 'V1.0.2', key: '2' },
    { name:'服务端发布日期', value: '2020年1月19日', key: '3' },
    { name:'前端软件版本', value: env.version, key: '4' },
    { name:'前端发布日期', value: '2020年1月18日', key: '5' },
    { name:'服务器域名', value: 'amccm.xiamenis.com', key: '6' },
    { name:'服务器当前时间', value: '2020-2-1 15:34:23', key: '7' },
    { name:'服务器已运行时间', value: '22天3小时55分钟', key: '8' },
    { name:'CPU型号[2核]', value: 'Intel(R) Xeon(R) Gold', key: '9' },
    { name:'服务器主机名', value: 'ecs-s6-large-2-linux-20200110105509', key: '10' },
    { name:'服务器操作系统', value: 'Linux  内核版本：2.6.32-754.23.1.el6.x86_64', key: '11' },
    { name:'服务器总空间', value: '39.246 GB', key: '12' },
    { name:'服务器可用空间', value: '19.759 GB', key: '13' },
    { name:'物理内存', value: '物理内存：共 3.742 GB', key: '14' },
    { name:'内存已用', value: '已用 3.615 GB', key: '15' },
];

export const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '参数值',
        dataIndex: 'value',
        key: 'value'
    }
];