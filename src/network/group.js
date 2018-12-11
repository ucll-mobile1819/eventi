import { sendAPIRequest } from ".";

// GETS

export const getGroups = async () => {
    return await sendAPIRequest(`group`, 'GET'); 
}

export const getGroup = async id => {
    return await sendAPIRequest(`group/${id}`, 'GET'); 
}

export const getGroupMembers = async id => {
    return await sendAPIRequest(`group/${id}/members`, 'GET')
};

export const getCreatedGroups = async () => {
    return await sendAPIRequest(`group/created`, 'GET');
};

export const getBannedUsers = async id => {
    return await sendAPIRequest(`group/${id}/banned-users`, 'GET');
};

// POSTS

export const postGroup = async (name, description, color) => {
    return await sendAPIRequest(`group`, 'POST', true, { name, description, color });
};

export const postJoinGroup = async inviteCode => {
    return await sendAPIRequest(`group/join/${inviteCode}`, 'POST');
};

export const postBanUser = async (id, username) => {
    return await sendAPIRequest(`group/${id}/ban/${username}`, 'POST');
};

export const postUnbanUser = async (id, username) => {
    return await sendAPIRequest(`group/${id}/unban/${username}`, 'POST');
};

// PUTS

export const putGroup = async (id, name, description, color) => {
    return await sendAPIRequest(`group/${id}`, 'PUT', true, { name, description, color });
};

export const putGenerateInviteCode = async id => {
    return await sendAPIRequest(`group/${id}/generate-invite-code`, 'PUT');
};

// DELETES

export const deleteGroup = async id => {
    return await sendAPIRequest(`group/${id}`, 'DELETE');
};

export const deleteUser = async (id, username) => {
    return await sendAPIRequest(`group/${id}/${username}`, 'DELETE');
};