import { fetchFailure } from '.';
import * as eventAPI from '../network/event';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export const fetchEvents = () => dispatch => {
    dispatch(fetchEventsBegin());
    eventAPI.getEvents()
    .then(events => dispatch(fetchEventsSuccess(events)))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchEventsBegin = () => ({
    type: FETCH_EVENTS_BEGIN,
});

export const fetchEventsSuccess = events => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: { events },
});