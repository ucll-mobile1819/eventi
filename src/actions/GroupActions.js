import { fetchFailure } from '.';
import * as groupAPI from '../network/group';

export const FETCH_GROUPS_BEGIN = 'FETCH_GROUPS_BEGIN';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
export const FETCH_GROUP_BEGIN = 'FETCH_GROUP_BEGIN';
export const FETCH_GROUP_SUCCESS = 'FETCH_GROUP_SUCCESS';
export const FETCH_MEMBERS_BEGIN = 'FETCH_MEMBERS_BEGIN';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';

export const fetchGroups = () => dispatch => {
    dispatch(fetchGroupsBegin());

    return groupAPI.getGroups()
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

export const fetchGroup = groupId => dispatch => {
    dispatch(fetchGroupBegin());
    return groupAPI.getGroup(groupId)
        .then(group => dispatch(fetchGroupSuccess(group)))
        .catch(error => dispatch(fetchFailure(error)));
};

export const fetchGroupBegin = () => ({
    type: FETCH_GROUP_BEGIN
});

export const fetchGroupSuccess = group => ({
    type: FETCH_GROUP_SUCCESS,
    payload: { group }
});

export const fetchMembers = () => dispatch => {
    dispatch(fetchMembersBegin());

    return groupAPI.getGroupMembers()
        .then(members => dispatch(fetchMembersSuccess(members)))
        .catch(error => dispatch(fetchFailure(error)));
};

export const fetchMembersBegin = () => ({
    type: FETCH_MEMBERS_BEGIN,
});

export const fetchMembersSuccess = members => ({
    type: FETCH_MEMBERS_SUCCESS,
    payload: { members },
});