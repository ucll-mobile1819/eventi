import { combineReducers } from 'redux';
import groupReducer from './GroupReducer'
import EventReducer from './EventReducer';

// Root Reducer
const rootReducer = combineReducers({
    group: groupReducer,
    event: EventReducer
});

export default rootReducer;