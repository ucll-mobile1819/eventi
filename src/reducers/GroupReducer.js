import { FETCH_GROUPS_BEGIN, FETCH_GROUPS_SUCCESS, FETCH_GROUP_BEGIN, FETCH_GROUP_SUCCESS, FETCH_MEMBERS_BEGIN, FETCH_MEMBERS_SUCCESS, FETCH_BANNED_USERS_BEGIN, FETCH_BANNED_USERS_SUCCESS } from "../actions/GroupActions";
import { FETCH_FAILURE } from "../actions";

const INITIAL_GROUP = {
    id: 0,
    name: '',
    description: '',
    color: '',
    creator: '',
    memberCount: 0
}

const INITIAL_STATE = {
    groups: [],
    members: [],
    bannedUsers: [],
    group: INITIAL_GROUP
};

const groupReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_GROUPS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null, // Needed to reset any previous errors,
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
                error: null,
                group: INITIAL_GROUP,
            };
        case FETCH_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                group: action.payload.group
            };
        case FETCH_MEMBERS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_MEMBERS_SUCCESS:
            return {
                ...state,
                loading: false,
                members: action.payload.members
            };
        case FETCH_BANNED_USERS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_BANNED_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                bannedUsers: action.payload.bannedUsers
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