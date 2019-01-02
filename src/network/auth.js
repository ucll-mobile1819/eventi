import { sendAPIRequest } from ".";

// POSTS

export const postLogin = async (username, password, handleErrors = false) => {
    return await sendAPIRequest(`auth/login`, 'POST', handleErrors, false, {
        username,
        password
    });
};