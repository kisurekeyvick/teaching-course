import * as ActionTypes from '../actionType';
import { combineReducers } from 'redux';

interface IMaterialChaperUpdateAction {
    type: string;
    [key: string]: any;
}

const initialState = {};

function chaperMaterial(state = initialState, action: IMaterialChaperUpdateAction) {
    switch(action.type) {
        case ActionTypes.CHAPTER_UPDATE:
            return {...state, ...action.data};
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    chaperMaterial
});

export default rootReducer;