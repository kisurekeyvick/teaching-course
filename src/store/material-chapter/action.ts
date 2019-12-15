import * as ActionTypes from '../actionType';

export function updateChapterMaterial(data: { [key: string]: any }) {
    return {
        type: ActionTypes.CHAPTER_UPDATE,
        data
    }
}