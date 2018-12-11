import { sendAPIRequest } from ".";

// GETS

export const getUser = async username => {
    return await sendAPIRequest(`user/${username}`, 'GET');
};

// POSTS

export const postUser = async (firstname, lastname, username, birthday, password, passwordConfirmation) => {
    return await sendAPIRequest(`user`, 'POST', false, {
        firstname,
        lastname,
        username,
        birthday,
        password,
        passwordConf: passwordConfirmation
    });
};

// PUTS

export const putUser = async (firstname, lastname, birthday, password, passwordConfirmation) => {
    return await sendAPIRequest(`user`, 'PUT', true, {
        firstname,
        lastname,
        birthday,
        password,
        passwordConf: passwordConfirmation
    });
};

