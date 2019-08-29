import * as ActionTypes from '../actionType';

/**
 * @func
 * @desc 更新用户信息
 * @param data 
 */
export function updateUserInfo(data: { [key: string]: any }) {
    return {
        type: ActionTypes.USERINFO_UPDATE,
        data
    };
};
