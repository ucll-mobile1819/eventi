import { fetchFailure } from '.';
import * as groupAPI from '../network/group';

export const FETCH_GROUPS_BEGIN = 'FETCH_GROUPS_BEGIN';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
export const FETCH_GROUP_BEGIN = 'FETCH_GROUP_BEGIN';
export const FETCH_GROUP_SUCCESS = 'FETCH_GROUP_SUCCESS';

export const fetchGroups = () => dispatch => {
    dispatch(fetchGroupsBegin());
    let newGroups = [];

    groupAPI.getGroups()
        .then(groups => {
            // get a list of all promises that are going to get the memberCount of each group
            let promises = [];       
            groups.forEach(group => promises.push(groupAPI.getMemberCountOfGroup(group.id)));

            // run all promises and put their values in a new array                
            return Promise.all(promises)
            .then(counts => {
                groups.forEach((group, index) => {
                    groups[index].memberCount = counts[index].count;
                })
                return groups;
            });
        })
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
    groupAPI.getGroup(groupId)
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