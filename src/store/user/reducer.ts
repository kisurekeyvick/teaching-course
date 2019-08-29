import * as ActionTypes from '../actionType';
import { combineReducers } from 'redux';

interface IUserinfoAction {
    type: string;
    [key: string]: any;
}

const initialState = {};

function userInfo(state = initialState, action: IUserinfoAction) {
    switch(action.type) {
        case ActionTypes.USERINFO_UPDATE:
            return action.data;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    userInfo
});

export default rootReducer;
