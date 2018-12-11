import { sendAPIRequest } from ".";

// GETS

/**
 * 
 * @param {String} type 'event' or 'poll' or null/undefined/''
 */
export const getEvents = async (type = null) => {
    return await sendAPIRequest(`event${!type ? '' : `?type=${type}`}`, 'GET');
};

export const getEvent = async id => {
    return await sendAPIRequest(`event/${id}`, 'GET');
};

/**
 * 
 * @param {String} type 'event' or 'poll' or null/undefined/''
 */
export const getGroupEvents = async (groupId, type) => {
    return await sendAPIRequest(`event/group/${groupId}${!type ? '' : `?type=${type}`}`, 'GET');
};

export const getVotes = async id => {
    return await sendAPIRequest(`event/${id}/votes`, 'GET');
};

export const getAttendances = async id => {
    return await sendAPIRequest(`event/${id}/attendances`, 'GET');
};

export const getAttendance = async id => {
    return await sendAPIRequest(`event/${id}/attendance`, 'GET');
};

// POSTS

export const postEvent = async (groupId, name, description, startTime, endTime, locationName, address, zipcode, city, housenumber, country) => {
    return await sendAPIRequest(`event`, 'POST', true, {
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
export const postEventWithPoll = async (groupId, name, description, locationName, address, zipcode, city, housenumber, country, pollDates) => {
    return await sendAPIRequest(`event`, 'POST', true, {
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

export const postVote = async (id, pollDateIds) => {
    return await sendAPIRequest(`event/${id}/vote`, 'POST', true, { pollDateIds });
};

export const postEndPoll = async (id, finalPollDateId) => {
    return await sendAPIRequest(`event/${id}/end-poll`, 'POST', { pollDateId: finalPollDateId });
};

/**
 * @param {String} state - 'going' or 'not going' or null|undefined
 */
export const postAttendance = async (id, state) => {
    return await sendAPIRequest(`event/${id}/attendance`, 'POST', true, { state });
};

// PUTS

export const putEvent = async (id, name, description, startTime, endTime, locationName, address, city, zipcode, country) => {
    return await sendAPIRequest(`event/${id}`, 'PUT', true, { id, name, description, startTime, endTime, locationName, address, city, zipcode, country });
};

// DELETES

export const deleteEvent = async id => {
    return await sendAPIRequest(`event/${id}`, 'DELETE');
};