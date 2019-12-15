import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import globalReducer from './globalLayout/reducer';
import chapterMaterial from './material-chapter/reducer';

const rootReducer = combineReducers({
    userReducer,
    globalReducer,
    chapterMaterial
});

export default rootReducer;
