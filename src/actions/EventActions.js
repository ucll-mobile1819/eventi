import { fetchFailure } from '.';
import * as eventAPI from '../network/event';
import * as commentAPI from '../network/comment';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const CHANGE_STATUS_EVENT_BEGIN = 'CHANGE_STATUS_EVENT_BEGIN';
export const CHANGE_STATUS_EVENT_SUCCESS = 'CHANGE_STATUS_EVENT_SUCCESS';

export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';

export const FETCH_ATT_BEGIN = 'FETCH_ATT_BEGIN';
export const FETCH_ATT_SUCCESS = 'FETCH_ATT_SUCCESS';

export const FETCH_COMMENT_BEGIN = 'FETCH_COMMENT_BEGIN';
export const FETCH_COMMENT_SUCCESS = 'FETCH_COMMENT_SUCCESS';

export const POST_COMMENT_BEGIN = 'POST_COMMENT_BEGIN';
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS';

export const FETCH_VOTES_BEGIN = 'FETCH_VOTES_BEGIN';
export const FETCH_VOTES_SUCCESS = 'FETCH_VOTES_SUCCESS';

export const PUT_EVENT_BEGIN = 'PUT_EVENT_BEGIN';
export const PUT_EVENT_SUCCESS = 'PUT_EVENT_SUCCESS';

export const END_POLL_BEGIN = 'END_POLL_BEGIN';
export const END_POLL_SUCCESS = 'END_POLL_SUCCESS';

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

//Fetch Attend


export const fetchAtt = (id) => dispatch => {
    dispatch(fetchAttBegin());
    return eventAPI.getAttendances(id)
    .then(status => {
        dispatch(fetchAttSuccess(status))
    })
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchAttBegin = () => ({
    type: FETCH_ATT_BEGIN,
});

export const fetchAttSuccess = status => ({
    type: FETCH_ATT_SUCCESS,
    payload: {status} ,
});

//fethc comments

export const fetchComments = (id) => dispatch => {
    dispatch(fetchCommentBegin());
    return commentAPI.getComments(id)
    .then(comments => {
        dispatch(fetchCommentSuccess(comments))
    })
    .catch(error => dispatch(fetchFailure(error, false)));
};

export const fetchCommentBegin = () => ({
    type: FETCH_COMMENT_BEGIN,
});

export const fetchCommentSuccess = comments => ({
    type: FETCH_COMMENT_SUCCESS,
    payload: {comments} ,
});

//Post comments

export const postComment = (id , content) => dispatch => {
    dispatch(postCommentBegin());
    return commentAPI.postComments(id,content)
    .then(comment => {
        dispatch(postCommentSuccess(comment))
    })
    .catch(error => dispatch(fetchFailure(error)));
};

export const postCommentBegin = () => ({
    type: POST_COMMENT_BEGIN,
});

export const postCommentSuccess = comment => ({
    type: POST_COMMENT_SUCCESS,
    payload: {comment} ,
});

//Fetch votes

export const fetchVotes = (id) => dispatch => {
    dispatch(fetchVotesBegin());
    return eventAPI.getVotes(id)
    .then(votes => {
        dispatch(fetchVotesSuccess(votes))
    })
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchVotesBegin = () => ({
    type: FETCH_VOTES_BEGIN,
});

export const fetchVotesSuccess = votes => ({
    type: FETCH_VOTES_SUCCESS,
    payload: {votes} ,
});

//Put 

export const putEvent = (id, name, description, startTime, endTime, locationName, address, pollDates) => dispatch => {
    dispatch(putEventBegin());
    return eventAPI.putEvent(id, name, description, startTime, endTime, locationName, address, null, null, null, pollDates)
    .then(event => {
        dispatch(PutEventSuccess(event))
    })
    .catch(error => dispatch(fetchFailure(error)));
};

export const putEventBegin = () => ({
    type: PUT_EVENT_BEGIN,
});

export const PutEventSuccess = event => ({
    type: PUT_EVENT_SUCCESS,
    payload: {event} ,
});

export const endPoll = (eventId, pollDateId) => dispatch => {
    dispatch(endPollBegin());

    return eventAPI.postEndPoll(eventId, pollDateId)
    .then(event => dispatch(endPollSuccess(event)))
    .catch(error => dispatch(fetchFailure(error)));
};

export const endPollBegin = () => ({
    type: END_POLL_BEGIN,
});

export const endPollSuccess = event => ({
    type: END_POLL_SUCCESS,
    payload: {event} ,
});