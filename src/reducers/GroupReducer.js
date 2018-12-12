import { FETCH_GROUPS_BEGIN, FETCH_GROUPS_SUCCESS } from "../actions/GroupActions";
import { FETCH_FAILURE } from "../actions";

const INITIAL_STATE = {
    groups: [],
};

const groupReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_GROUPS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_GROUPS_SUCCESS:
            return {
                ...state,
                loading: false,
                groups: action.payload.groups
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

export default groupReducer;