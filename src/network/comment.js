import { sendAPIRequest } from ".";

// GETS

export const getComments = async (eventId, handleErrors = false) => {
    return await sendAPIRequest(`comment/event/${eventId}`, 'GET', handleErrors);
};

// POSTS

export const postComments = async (eventId, content, handleErrors = false) => {
    return await sendAPIRequest(`comment`, 'POST', handleErrors, true, { eventId, content });
};