import { combineReducers } from 'redux';
import groupReducer from './GroupReducer'

// Root Reducer
const rootReducer = combineReducers({
    group: groupReducer,
});

export default rootReducer;