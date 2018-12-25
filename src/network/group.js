import { sendAPIRequest } from ".";

// GETS

export const getGroups = async (handleErrors = false) => {
    return await sendAPIRequest(`group`, 'GET', handleErrors); 
}

export const getGroup = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}`, 'GET', handleErrors); 
}

export const getGroupMembers = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/members`, 'GET', handleErrors)
};

export const getCreatedGroups = async (handleErrors = false) => {
    return await sendAPIRequest(`group/created`, 'GET', handleErrors);
};

export const getBannedUsers = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/banned-users`, 'GET', handleErrors);
};

export const getMemberCountOfGroup = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/membercount`, 'GET', handleErrors);
};

// POSTS

export const postGroup = async (name, description, color, handleErrors = false) => {
    return await sendAPIRequest(`group`, 'POST', handleErrors, true, { name, description, color });
};

export const postJoinGroup = async (inviteCode, handleErrors = false) => {
    return await sendAPIRequest(`group/join/${inviteCode}`, 'POST', handleErrors);
};

export const postBanUser = async (id, username, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/ban/${username}`, 'POST', handleErrors);
};

export const postUnbanUser = async (id, username, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/unban/${username}`, 'POST', handleErrors);
};

// PUTS

export const putGroup = async (id, name, description, color, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}`, 'PUT', handleErrors, true, { name, description, color });
};

export const putGenerateInviteCode = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/generate-invite-code`, 'PUT', handleErrors);
};

// DELETES

export const deleteGroup = async (id, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}`, 'DELETE', handleErrors);
};

export const deleteUser = async (id, username, handleErrors = false) => {
    return await sendAPIRequest(`group/${id}/${username}`, 'DELETE', handleErrors);
};