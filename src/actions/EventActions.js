import { fetchFailure } from '.';
import * as eventAPI from '../network/event';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export const fetchEvents = () => dispatch => {
    dispatch(fetchEventsBegin());
    eventAPI.getEvents()
    .then(events => dispatch(fetchEventsSuccess(events.map(el => {
        if (el.startTime !== null) el.startTime = new Date(el.startTime);
        if (el.endTime !== null) el.endTime = new Date(el.endTime);
        return el;
    }))))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchEventsBegin = () => ({
    type: FETCH_EVENTS_BEGIN,
});

export const fetchEventsSuccess = events => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: { events },
});