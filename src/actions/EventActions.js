import { fetchFailure } from '.';
import * as eventAPI from '../network/event';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const CHANGE_STATUS_EVENT_BEGIN = 'CHANGE_STATUS_EVENT_BEGIN';
export const CHANGE_STATUS_EVENT_SUCCESS = 'CHANGE_STATUS_EVENT_SUCCESS';


export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';

export const fetchEvents = () => dispatch => {
    dispatch(fetchEventsBegin());
    return eventAPI.getEvents()
    .then(events => dispatch(fetchEventsSuccess(events)))
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
    payload:  {events} ,
});

export const changeStatusEventBegin = () => ({
    type: CHANGE_STATUS_EVENT_BEGIN,
});

export const changeStatusEventSuccess = data => ({
    type: CHANGE_STATUS_EVENT_SUCCESS,
    payload: data ,
});

//Fetch single Event code

export const fetchEvent = (id) => dispatch => {
    dispatch(fetchEventBegin());
    return eventAPI.getEvent(id)
    .then(event => dispatch(fetchEventSuccess(event)))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchEventBegin = () => ({
    type: FETCH_EVENT_BEGIN,
});

export const fetchEventSuccess = event => ({
    type: FETCH_EVENT_SUCCESS,
    payload: { event },
});
