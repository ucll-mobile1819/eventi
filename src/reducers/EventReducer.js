import { FETCH_EVENTS_BEGIN, FETCH_EVENTS_SUCCESS } from "../actions/EventActions";
import { FETCH_FAILURE } from "../actions";

const INITIAL_STATE = {
    events: [],
};

const eventReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_EVENTS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_EVENTS_SUCCESS:
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

export default eventReducer;