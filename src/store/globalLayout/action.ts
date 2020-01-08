import * as ActionTypes from '../actionType';

/**
 * @func
 * @desc 更新你要搜索的书名
 * @param name 
 */
export function updateSearchBook(name: string) {
    return {
        type: ActionTypes.SEARCHBOOK_UPDATE,
        data: name
    }
}

/**
 * @func
 * @desc 更新react-route中的history方法
 * @param name 
 */
export function updateRouteHistory(name: string) {
    return {
        type: ActionTypes.GLOBAL_ROUTE_HISTORY,
        data: name
    }
}