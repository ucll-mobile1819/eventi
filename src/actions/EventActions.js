import { fetchFailure } from '.';
import * as eventAPI from '../network/event';
import * as commentAPI from '../network/comment';

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';

export const FETCH_EVENT_OF_GROUP_BEGIN = 'FETCH_EVENT_OF_GROUP_BEGIN';
export const FETCH_EVENT_OF_GROUP_SUCCESS = 'FETCH_EVENT_OF_GROUP_SUCCESS';

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

// Fetch events of one group

export const fetchEventsOfGroup = groupId => dispatch => {
    dispatch(fetchEventsOfGroupBegin());
    return eventAPI.getGroupEvents(groupId)
        .then(events => dispatch(fetchEventsOfGroupSuccess(events)))
        .catch(error => dispatch(fetchFailure(error)));
};

export const fetchEventsOfGroupBegin = () => ({
    type: FETCH_EVENT_OF_GROUP_BEGIN
});

export const fetchEventsOfGroupSuccess = events => ({
    type: FETCH_EVENT_OF_GROUP_SUCCESS,
    payload: { events }
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
    .catch(error => dispatch(fetchFailure(error)));
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
    console.log(id)
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

