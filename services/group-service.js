const User = require('../models/user');
const Group = require('../models/group');

function createGroup(currentUser, name, description, color) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.Group.create({
            name,
            description,
            color
        })
        .then(group => {
            tmpGroup = group;
            return group.setCreator(currentUser);
        })
        .then(() => {
            return tmpGroup.addUser(currentUser);
        })
        .then(() => resolve(tmpGroup));
    });
}

function updateGroup(currentUser, groupId, name, description, color) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getCreator();
        })
        .then(user => {
            if (user.username !== currentUser.username) return Promise.reject(new Error('Only the creator can edit the group.'));
            // ^ If you use reject(err); here, the chain will still be continued (goes into the next then chained item)
            // For this situation return Promise.reject(err); is needed to stop the next then chained items from executing
            // and make it go directly into the .catch block

            [ tmpGroup.name, tmpGroup.description, tmpGroup.color ] = [ name, description, color ];
            // ^ Same as: tmpGroup.name = name; tmpGroup.description = description; tmpGroup.color = color;
            return tmpGroup.save();
        })
        .then(() => {
            resolve();
        })
        .catch(err => reject(err)); // Catching the possible error if the user is not the creator of the group which he's trying to edit or if the groupId does not exist
    });
}

function removeGroup(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the creator of a group can remove it.'));
            return Promise.all([ tmpGroup.getEvents(), tmpGroup.setUsers([]), tmpGroup.setBannedUsers([]) ]);
        })
        .then(results => Promise.all([ tmpGroup.destroy(), ...results[0].map(el => el.destroy()) ]))
        // Explanation of above line:
        // The connection between the users in the group and the group itself (M-N) has already been deleted
        // Now we still need to destroy the group itself and all of the events linked to that group (1-N)
        // Promise.all([x1, x2, ...]) accepts multiple promises and waits until all of them are resolved until resolving himself
        // First promise in the array is destroying the group itself: tmpGroup.destroy()
        // results[0] is the first result of the previous Promise.all (= tmpGroup.getEvents()). We map this (= transform every element of the array into a new value)
        // to a promise of destroying the object, which leaves us with [ tmpGroup.destroy(), [ event1.destroy(), event2.destroy(), event3.destroy(), ... ] ]
        // By using the spread operator (= ...) in front of the array, we extract the array elements and place them as normal arguments
        // => Promise.all([ tmpGroup.destroy(), event1.destroy(), event2.destroy(), event3.destroy(), ... ])
        .then(() => resolve())
        .catch(err => reject(err));
    });
}

function getGroup(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        currentUser.getGroups({ where: { id: groupId } })
        .then(groups => {
            if (!groups || groups.length === 0) return Promise.reject(new Error('You do not belong to this group.'));
            resolve(groups[0]);
        })
        .catch(err => reject(err));
    });
}

function getGroupMembers(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            return group.getUsers();
        })
        .then(users => {
            let found = false;
            users.forEach(user => {
                if (user.username === currentUser.username) found = true;
            });
            if (!found) return Promise.reject(new Error('You do not belong to this group.'));
            resolve(users);
        })
        .catch(err => {
            reject(err);
        });
    });
}

function removeUserFromGroup(currentUser, username, groupId) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        let tmpUser;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getUsers({ where: { username } });
        })
        .then(users => {
            if (!users || users.length === 0) return Promise.reject(new Error('That user does not belong to that group.'));
            tmpUser = users[0];
            return tmpGroup.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username && username !== currentUser.username)
                return Promise.reject(new Error('You are not allowed to remove that user from the group.'));
            if (creator.username === tmpUser.username) {
                return removeGroup(currentUser, groupId);
            } else {
                return tmpGroup.removeUser(tmpUser);
            }
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
}

function getJoinedGroups(currentUser) {
    return currentUser.getGroups();
}

function getCreatedGroups(currentUser) {
    return currentUser.getCreatedGroups();
}

function banUser(currentUser, groupId, username) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        let tmpUser;
        if (currentUser.username === username) return reject(new Error('You can\'t ban yourself.'));
        Promise.all([ User.User.findByPrimary(username), Group.Group.findById(groupId) ])
        .then(results => {
            tmpUser = results[0];
            tmpGroup = results[1];
            if (!tmpGroup) return Promise.reject(new Error('This group does not exist'));
            if (!tmpUser) return Promise.reject(new Error('This user does not exist'));
            return tmpGroup.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the creator of the group can ban users.'));
            return Group.banUser(tmpGroup, tmpUser);
        })
        .then(resolve)
        .catch(reject);
    });
}

function unbanUser(currentUser, groupId, username) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        let tmpUser;
        Promise.all([ User.User.findByPrimary(username), Group.Group.findById(groupId) ])
        .then(results => {
            tmpUser = results[0];
            tmpGroup = results[1];
            if (!tmpGroup) return Promise.reject(new Error('This group does not exist'));
            if (!tmpUser) return Promise.reject(new Error('This user does not exist'));
            return tmpGroup.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the creator of the group can unban users.'));
            return Group.unbanUser(tmpGroup, tmpUser);
        })            
        .then(resolve)
        .catch(reject);
    });
}

function generateInviteCode(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        if (!Number.isInteger(Number(groupId))) return reject(new Error('Group id must be an existing id.'));
        groupId = Number(groupId);
        currentUser.getCreatedGroups()
        .then(groups => {
            let index = groups.map(el => el.id).indexOf(groupId);
            if(index === -1) return Promise.reject(new Error('Only the owner of the group can generate invite codes.'));
            return Group.createInviteCode(groups[index]);
        })
        .then(resolve)
        .catch(reject);
    });
}

function getBannedUsers(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('That group does not exist.'));
            tmpGroup = group;
            return group.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the user of the group can see the banned users.'));
            return tmpGroup.getBannedUsers();
        })
        .then(resolve)
        .catch(reject);
    });
}

function joinGroup(currentUser, inviteCode) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.Group.findOne({ where: { invite_code: inviteCode } })
        .then(group => {
            if (!group) return Promise.reject(new Error('This invite code is invalid/expired.'));
            tmpGroup = group;
            return group.getUsers();
        })
        .then(users => {
            if (users.map(el => el.username).indexOf(currentUser.username) !== -1) return Promise.reject(new Error('You are already in this group.'));
            return tmpGroup.addUser(currentUser);
        })
        .then(resolve)
        .catch(reject);
    });
}

module.exports = { createGroup, updateGroup, removeGroup, getGroup, removeUserFromGroup, getJoinedGroups, getCreatedGroups, getGroupMembers, banUser, unbanUser, getBannedUsers, generateInviteCode, joinGroup };
