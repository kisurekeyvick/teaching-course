import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import globalReducer from './globalLayout/reducer';

const rootReducer = combineReducers({
    userReducer,
    globalReducer
});

export default rootReducer;
