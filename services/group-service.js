const User = require('../models/user');
const Group = require('../models/group');
const eventService = require('../services/event-service');
const essentialisizer = require('../util/essentialisizer');

const trimStrings = strings => strings.map(el => typeof el === 'string' ? el.trim() : el);

function createGroup(currentUser, name, description, color) {
    return new Promise((resolve, reject) => {
        [ name, description, color ] = trimStrings([ name, description, color ]);
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
        .then(() => Promise.all([ tmpGroup.addUser(currentUser), generateInviteCode(currentUser, tmpGroup.id) ]))
        .then(() => Promise.all([ Group.Group.findById(tmpGroup.id), getGroupMemberCount(currentUser, tmpGroup.id) ]))
        .then(results => essentialisizer.essentializyGroup(results[0], results[1], true))
        .then(resolve)
        .catch(reject);
    });
}

function updateGroup(currentUser, groupId, name, description, color) {
    return new Promise((resolve, reject) => {
        [ name, description, color ] = trimStrings([ name, description, color ]);
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
        .then(() => getGroupMemberCount(currentUser, tmpGroup.id))
        .then(memberCount => essentialisizer.essentializyGroup(tmpGroup, memberCount))
        .then(resolve)
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
        .then(results => Promise.all(results[0].map(el => eventService.deleteEvent(currentUser, el.id))))
        .then(() => tmpGroup.destroy())
        .then(() => resolve())
        .catch(err => reject(err));
    });
}

function getGroup(currentUser, groupId) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        currentUser.getGroups({ where: { id: groupId } })
        .then(groups => {
            if (!groups || groups.length === 0) return Promise.reject(new Error('You do not belong to this group.'));
            tmpGroup = groups[0];
            return Promise.all([ tmpGroup.getCreator(), getGroupMemberCount(currentUser, tmpGroup.id) ]);
        })
        .then(results => essentialisizer.essentializyGroup(tmpGroup, results[1], (currentUser.username === results[0].username)))
        .then(resolve)
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
            return Promise.all(users.map(el => essentialisizer.essentializyUser(el)));
        })
        .then(resolve)
        .catch(err => {
            reject(err);
        });
    });
}

function getGroupMemberCount(currentUser, groupId) {
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
            return resolve(users.length);
        })
        .catch(reject);
    });
}

function removeUserFromGroup(currentUser, username, groupId) {
    return new Promise((resolve, reject) => {
        [ username ] = trimStrings([ username ]);
        let tmpGroup;
        let tmpUser;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            groupId = parseInt(groupId);
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
                // Removing user poll votes & user events
                let removeUserPollVotes = () => new Promise((resolve, reject) => {
                    tmpGroup.getEvents()
                    .then(events => {
                        return Promise.all(events.map(el => el.getPollDates()));
                    })
                    .then(pollDates => Promise.all([].concat.apply([], pollDates).map(el => {
                        return el.removeUser(tmpUser);
                    })))
                    .then(resolve)
                    .catch(reject);
                });
                let removeUserEvents = () => new Promise((resolve, reject) => {
                    let tmpEvents;
                    tmpUser.getEvents()
                    .then(events => {
                        tmpEvents = events;
                        return Promise.all(events.map(el => el.getGroup()));
                    })
                    .then(groups => {
                        let eventsToDelete = [];
                        groups.forEach((el, index) => {
                            if (el.id === groupId) {
                                eventsToDelete.push(tmpEvents[index]);
                            }
                        });
                        return Promise.all(eventsToDelete.map(el => eventService.deleteEvent(currentUser, el.id)));
                    })
                    .then(() => resolve())
                    .catch(reject);
                });
                let removeAttendances = () => new Promise((resolve, reject) => {
                    tmpUser.getEventAttendances()
                    .then(attendances => {
                        let removals = [];
                        attendances.forEach(attendance => {
                            if (attendance.group_id === groupId) {
                                removals.push(attendance.removeUserAttendance(tmpUser));
                            }
                        });
                        return Promise.all(removals);
                    })
                    .then(() => resolve())
                    .catch(reject);
                });

                // Removing user events must happen before removing user poll votes to avoid conflicts
                // of removing poll votes of an event which has already been removed
                removeUserEvents()
                .then(() => Promise.all([ removeUserPollVotes(), removeAttendances() ]))
                .then(() => tmpGroup.removeUser(tmpUser))
                .then(() => resolve())
                .catch(reject);
            }
        })
        .catch(err => reject(err));
    });
}

function getJoinedGroups(currentUser) {
    return new Promise((resolve, reject) => {
        let tmpGroups;
        currentUser.getGroups()
        .then(groups => {
            tmpGroups = groups;
            return Promise.all(groups.map(el => getGroupMemberCount(currentUser, el.id)));
        })
        .then(memberCounts => Promise.all(tmpGroups.map((el, i) => essentialisizer.essentializyGroup(el, memberCounts[i]))))
        .then(resolve)
        .catch(reject);
    });
}

function getCreatedGroups(currentUser) {
    return new Promise((resolve, reject) => {
        let tmpGroups;
        currentUser.getCreatedGroups()
        .then(groups => {
            tmpGroups = groups;
            return Promise.all(groups.map(el => getGroupMemberCount(currentUser, el.id)));
        })
        .then(memberCounts => Promise.all(tmpGroups.map((el, i) => essentialisizer.essentializyGroup(el, memberCounts[i]))))
        .then(resolve)
        .catch(reject);
    });
}

function banUser(currentUser, groupId, username) {
    return new Promise((resolve, reject) => {
        [ username ] = trimStrings([ username ]);
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
        .then(() => removeUserFromGroup(currentUser, username, groupId))
        .then(() => resolve())
        .catch(reject);
    });
}

function unbanUser(currentUser, groupId, username) {
    return new Promise((resolve, reject) => {
        [ username ] = trimStrings([ username ]);
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
        .then(() => resolve())
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
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the creator of the group can see the banned users.'));
            return tmpGroup.getBannedUsers();
        })
        .then(users => Promise.all(users.map(el => essentialisizer.essentializyUser(el))))
        .then(resolve)
        .catch(reject);
    });
}

function joinGroup(currentUser, inviteCode) {
    return new Promise((resolve, reject) => {
        [ inviteCode ] = trimStrings([ inviteCode ]);
        let tmpGroup;
        Group.Group.findOne({ where: { invite_code: inviteCode } })
        .then(group => {
            if (!group) return Promise.reject(new Error('This invite code is invalid/expired.'));
            tmpGroup = group;
            return Promise.all([ group.getUsers(), group.getBannedUsers() ]);
        })
        .then(results => {
            if (results[1].map(el => el.username).indexOf(currentUser.username) !== -1) return Promise.reject(new Error('You are banned from this group.'));
            if (results[0].map(el => el.username).indexOf(currentUser.username) !== -1) return Promise.reject(new Error('You are already in this group.'));
            return tmpGroup.addUser(currentUser);
        })
        .then(() => getGroupMemberCount(currentUser, tmpGroup.id))
        .then(memberCount => essentialisizer.essentializyGroup(tmpGroup, memberCount))
        .then(resolve)
        .catch(reject);
    });
}

module.exports = { createGroup, updateGroup, removeGroup, getGroup, removeUserFromGroup, getJoinedGroups, getCreatedGroups, getGroupMembers, getGroupMemberCount, banUser, unbanUser, getBannedUsers, generateInviteCode, joinGroup };
