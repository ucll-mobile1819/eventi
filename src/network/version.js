import { sendAPIRequest } from ".";

// GETS

export const getVersion = async (handleErrors = false) => {
    return await sendAPIRequest('version', 'GET', handleErrors, false);
};