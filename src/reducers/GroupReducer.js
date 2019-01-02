import { FETCH_GROUPS_BEGIN, FETCH_GROUPS_SUCCESS, FETCH_GROUP_BEGIN, FETCH_GROUP_SUCCESS } from "../actions/GroupActions";
import { FETCH_FAILURE } from "../actions";

const INITIAL_STATE = {
    groups: [],
    group: {
        id: 0,
        name: '',
        description: '',
        color: '',
        creator: '',
        memberCount: 0
    }
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
        case FETCH_GROUP_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                group: action.payload.group
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