import { FETCH_FAILURE } from "../actions";
import { FETCH_LOGIN_BEGIN, FETCH_LOGIN_SUCCESS, FETCH_LOGOUT, FETCH_LOGOUT_BEGIN } from "../actions/AuthenticationActions";

const INITIAL_STATE = {
    user: {
        firstname: '',
        lastname: '',
        username: '',
        birthday: null
    }
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_LOGIN_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.user
            };
        case FETCH_LOGOUT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_LOGOUT_BEGIN:
            return {
                ...state,
                loading: false,
            };
        case FETCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default authReducer;