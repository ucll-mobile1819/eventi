import { fetchFailure } from '.';
import * as groupAPI from '../network/group';

export const FETCH_GROUPS_BEGIN = 'FETCH_GROUPS_BEGIN';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';

export const fetchGroups = () => dispatch => {
    dispatch(fetchGroupsBegin());
    groupAPI.getGroups()
    .then(groups => dispatch(fetchGroupsSuccess(groups)))
    .catch(error => dispatch(fetchFailure(error)));
};

export const fetchGroupsBegin = () => ({
    type: FETCH_GROUPS_BEGIN,
});

export const fetchGroupsSuccess = groups => ({
    type: FETCH_GROUPS_SUCCESS,
    payload: { groups },
});

export const createGroup = async (groupname, description, color) => {
    return await groupAPI.postGroup(groupname, description, color);
};