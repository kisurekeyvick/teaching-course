import { env } from 'environment/index';

export interface IDataSource {
    name: string;
    value: string;
    key: string;
};

export const dataSource: IDataSource[] = [
    { name:'系统名称', value: '厦门信息学校城市轨道交通教学资源管理系统', key: '1' },
    { name:'web端软件版本', value: env.version, key: '2' },
    { name:'web软件发布日期', value: env.releaseDate, key: '3' },
    { name:'服务端软件版本', value: 'V1.0.2', key: '4' },
    { name:'服务端软件发布日期', value: '2020年1月19日', key: '5' },
    { name:'服务器当前时间', value: '2020-2-1 15:34:23', key: '6' },
    { name:'服务器已运行时间', value: '22天3小时55分钟', key: '7' },
    { name:'磁盘总空间', value: '39.246 GB', key: '8' },
    { name:'磁盘可用空间', value: '19.759 GB', key: '9' },
    { name:'物理内存', value: '3.742 GB', key: '10' },
    { name:'已使用内存', value: '3.615 GB', key: '11' },
    { name:'CPU型号', value: 'Intel(R) Xeon(R) Gold', key: '12' },
    { name:'服务器主机名', value: 'ecs-s6-large-2-linux', key: '13' },
    { name:'服务器操作系统', value: 'Linux 内核版本：2.6.32-754.23.1.el6.x86_64', key: '14' },
    { name:'服务器域名', value: 'amccm.xiamenis.com', key: '15' },

];

export const columns = [
    {
        title: '监控项目',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '当前状态',
        dataIndex: 'value',
        key: 'value'
    }
];