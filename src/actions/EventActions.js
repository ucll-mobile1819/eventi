import { fetchFailure } from '.';
import * as eventAPI from '../network/event';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const CHANGE_STATUS_EVENT_BEGIN = 'CHANGE_STATUS_EVENT_BEGIN';
export const CHANGE_STATUS_EVENT_SUCCESS = 'CHANGE_STATUS_EVENT_SUCCESS';

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


export const changeStatus = (id, status) => dispatch => {
    dispatch(changeStatusEventBegin());
    return eventAPI.postAttendance(id , status)
    .then(() => dispatch(changeStatusEventSuccess({ id,status })))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchEventsBegin = () => ({
    type: FETCH_EVENTS_BEGIN,
});

export const fetchEventsSuccess = events => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: { events },
});

export const changeStatusEventBegin = () => ({
    type: CHANGE_STATUS_EVENT_BEGIN,
});

export const changeStatusEventSuccess = data => ({
    type: CHANGE_STATUS_EVENT_SUCCESS,
    payload: data ,
});