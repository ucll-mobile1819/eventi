import { sendAPIRequest } from ".";

// GETS

export const getVersion = async () => {
    return await sendAPIRequest('version', 'GET', false);
};