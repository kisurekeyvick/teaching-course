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