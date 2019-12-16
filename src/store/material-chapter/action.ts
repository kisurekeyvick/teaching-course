import * as ActionTypes from '../actionType';

export function updateChapterMaterial(data: { [key: string]: any }) {
    return {
        type: ActionTypes.CHAPTER_UPDATE,
        data
    }
}

// /** 更新loading状态 */
// export function updateMaterialLoadingStatus(data: { key: string }) {
//     return {
//         type: ActionTypes.CHAPTER_UPDATE,
//         data
//     }
// }