import { sendAPIRequest, handleRequestErrors } from ".";

// GETS

export const getUser = async (username, handleErrors = false) => {
    return await sendAPIRequest(`user/${username}`, 'GET', handleErrors);
};

// POSTS

export const postUser = async (firstname, lastname, username, birthday, password, passwordConfirmation, handleErrors = false) => {
    return await sendAPIRequest(`user`, 'POST', handleErrors, false, {
        firstname,
        lastname,
        username,
        birthday,
        password,
        passwordConf: passwordConfirmation
    });
};

// PUTS

export const putUser = async (firstname, lastname, birthday, password, passwordConfirmation, handleErrors = false) => {
    return await sendAPIRequest(`user`, 'PUT', handleErrors, true, {
        firstname,
        lastname,
        birthday,
        password,
        passwordConf: passwordConfirmation
    });
};

