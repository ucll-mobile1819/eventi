import { FETCH_EVENTS_BEGIN, FETCH_EVENTS_SUCCESS, CHANGE_STATUS_EVENT_BEGIN, CHANGE_STATUS_EVENT_SUCCESS } from "../actions/EventActions";
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
                events: action.payload.events
            };
        case FETCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CHANGE_STATUS_EVENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CHANGE_STATUS_EVENT_SUCCESS:
            let events = [...state.events];
            events.map((event) => {
                if(event.id === action.payload.id){
                    event.status = action.payload.status;
                }
                return event;
            })
            return {
                ...state,
                loading: false,
                events: events,
            };
        default:
            return state;
    }
};

export default eventReducer;