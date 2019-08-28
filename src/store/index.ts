import rootReducer from './rootReducer';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const initState: any = {};
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, initState, applyMiddleware(
    sagaMiddleware
));

//Todo:sagaMiddleware.run(saga文件);
