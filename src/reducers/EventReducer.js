import { PUT_EVENT_BEGIN,PUT_EVENT_SUCCESS,FETCH_VOTES_SUCCESS,FETCH_VOTES_BEGIN, POST_COMMENT_BEGIN,POST_COMMENT_SUCCESS,FETCH_COMMENT_BEGIN,FETCH_COMMENT_SUCCESS,FETCH_ATT_BEGIN, FETCH_ATT_SUCCESS, FETCH_EVENTS_BEGIN, FETCH_EVENTS_SUCCESS, FETCH_EVENT_BEGIN, FETCH_EVENT_SUCCESS, CHANGE_STATUS_EVENT_BEGIN, CHANGE_STATUS_EVENT_SUCCESS } from "../actions/EventActions";
import { FETCH_FAILURE } from "../actions";


const INITIAL_STATE = {
    events: [],
    emptyEvent: {
        id: -1,
        name: '',
        description: '',
        startTime: null,
        endTime: null,
        address: '',
        locationName: '',
        city: '',
        zipcode: '',
        country: '',
        type: 'event',
        status: 'Pending',
        pollDates:[],
        group: {
            id: -1,
            name: '',
            color: '',
            creator: '',
        },
        creator: {
            firstname: '',
            lastname: '',
            username: '',
        }
    },
    status:[],
    comments:[],
    comment:[],
    votes:[],
};

let events;

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
        case FETCH_ATT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_ATT_SUCCESS:
            return {
                ...state,
                loading: false,
                status: action.payload.status
            };
        case FETCH_EVENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_EVENT_SUCCESS:
            events = state.events.map(el => el.id === action.payload.event.id ? action.payload.event : el);
            return {
                ...state,
                loading: false,
                events,
                event: action.payload.event
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
            events = [...state.events];
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
        case FETCH_COMMENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                comments: action.payload.comments
            };

        case POST_COMMENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case POST_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                comment: action.payload.comment
            };

        case FETCH_VOTES_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case FETCH_VOTES_SUCCESS:
            return {
                ...state,
                loading: false,
                votes: action.payload.votes
            };
        case PUT_EVENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null // Needed to reset any previous errors
            };
        case PUT_EVENT_SUCCESS:
            let events = state.events.map(el => el.id === action.payload.event.id ? action.payload.event : el);
            return {
                ...state,
                loading: false,
                events
            };
        default:
            return state;
    }
};

export default eventReducer;