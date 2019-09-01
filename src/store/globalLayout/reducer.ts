import * as ActionTypes from '../actionType';
import { combineReducers } from 'redux';

interface ISearchBookAction {
    type: string;
    [key: string]: any;
}

const initialState = ''; 

function bookName(state = initialState, action: ISearchBookAction) {
    switch(action.type) {
        case ActionTypes.SEARCHBOOK_UPDATE:
            return action.data;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    bookName
});

export default rootReducer; 
