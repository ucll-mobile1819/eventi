import { sendAPIRequest } from ".";

export const fetchGroups = async () => {
    return await sendAPIRequest('group', 'get', false);
};