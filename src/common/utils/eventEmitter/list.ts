import { EventEmitter } from './eventEmitter';

/**
 * @desc 事件监听列表
 */
export enum EventEmitterList {
    /** 搜索教材名称时间 */
    SEARCHCOURSEEVENT = 'SEARCHCOURSEEVENT'
}

export const globalEventEmitter = new EventEmitter(20);