import { sendAPIRequest } from ".";

// POSTS

export const postLogin = async (username, password) => {
    return await sendAPIRequest(`auth/login`, 'POST', false, {
        username,
        password
    });
};