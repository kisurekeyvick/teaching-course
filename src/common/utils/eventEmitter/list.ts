import { EventEmitter } from './eventEmitter';

/**
 * @desc 事件监听列表
 */
export enum EventEmitterList {
    /** 搜索教材名称时间 */
    SEARCHCOURSEEVENT = 'SEARCHCOURSEEVENT',
    /** 用户头像信息更新 */
    USERINFOUPDATE = 'USERINFOUPDATE'
}

export const globalEventEmitter = new EventEmitter(20);