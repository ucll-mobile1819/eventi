import { sendAPIRequest } from ".";

// GETS

/**
 * 
 * @param {String} type 'event' or 'poll' or null/undefined/''
 */
export const getEvents = async (type = null, handleErrors = false) => {
    return await sendAPIRequest(`event${!type ? '' : `?type=${type}`}`, 'GET', handleErrors);
};

export const getEvent = async (id, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}`, 'GET', handleErrors);
};

/**
 * 
 * @param {String} type 'event' or 'poll' or null/undefined/''
 */
export const getGroupEvents = async (groupId, type, handleErrors = false) => {
    return await sendAPIRequest(`event/group/${groupId}${!type ? '' : `?type=${type}`}`, 'GET', handleErrors);
};

export const getVotes = async (id, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/votes`, 'GET', handleErrors);
};

export const getAttendances = async (id, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/attendances`, 'GET', handleErrors);
};

export const getAttendance = async (id, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/attendance`, 'GET', handleErrors);
};

// POSTS

export const postEvent = async (groupId, name, description, startTime, endTime, locationName, address, zipcode, city, housenumber, country, handleErrors = false) => {
    return await sendAPIRequest(`event`, 'POST', handleErrors, true, {
        type: 'event',
        groupId,
        name,
        description,
        startTime,
        endTime,
        locationName,
        address,
        zipcode,
        city,
        housenumber,
        country
    });
};

/**
 * 
 * @param {Object[]} pollDates - Array of poll dates.
 * @param {Date} pollDates[].startTime - Start time of poll item.
 * @param {Date} pollDates[].endTime - Start time of poll item.
 */
export const postEventWithPoll = async (groupId, name, description, locationName, address, zipcode, city, housenumber, country, pollDates, handleErrors = false) => {
    return await sendAPIRequest(`event`, 'POST', handleErrors, true, {
        type: 'poll',
        groupId,
        name,
        description,
        locationName,
        address,
        zipcode,
        city,
        housenumber,
        country,
        pollDates
    });
};

export const postVote = async (id, pollDateIds, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/vote`, 'POST', handleErrors, true, { pollDateIds });
};

export const postEndPoll = async (id, finalPollDateId, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/end-poll`, 'POST', handleErrors, { pollDateId: finalPollDateId });
};

/**
 * @param {String} state - 'going' or 'not going' or null|undefined
 */
export const postAttendance = async (id, state, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}/attendance`, 'POST', handleErrors, true, { state });
};

// PUTS

export const putEvent = async (
    id, 
    name, 
    description, 
    startTime, 
    endTime, 
    locationName, 
    address, 
    city, 
    zipcode, 
    country, 
    pollDates, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}`, 'PUT', handleErrors, true, { id, name, description, startTime, endTime, locationName, address, city, zipcode, country, pollDates });
};

// DELETES

export const deleteEvent = async (id, handleErrors = false) => {
    return await sendAPIRequest(`event/${id}`, 'DELETE', handleErrors);
};