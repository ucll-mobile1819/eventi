import { combineReducers } from 'redux';
import groupReducer from './GroupReducer'
import { FETCH_LOGOUT_SUCCESS } from '../actions/AuthenticationActions';
import authReducer from './AuthReducer';

// Root Reducer
const appReducer = combineReducers({
    group: groupReducer,
    user: authReducer,
});

const rootReducer = (state, action) => {
    if (action.type === FETCH_LOGOUT_SUCCESS) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;