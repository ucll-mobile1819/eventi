import { sendAPIRequest } from ".";

// GETS

export const getComments = async eventId => {
    return await sendAPIRequest(`comment/event/${eventId}`, 'GET');
};

// POSTS

export const postComments = async (eventId, content) => {
    return await sendAPIRequest(`comment`, 'GET', true, { eventId, content });
};