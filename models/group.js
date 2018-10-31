const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');
const generateId = require('nanoid/async/generate');

let models = {};

const Group = connection.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    color: Sequelize.STRING,
    invite_code: Sequelize.STRING
});

function defineModels(items) {
    models = items;
    Group.belongsToMany(models.User.User, { through: 'UserGroup' }); // Defines many to many relationship with table in between (also in User model)
    Group.belongsTo(models.User.User, { as: 'Creator', constraints: false, foreignKey: 'creator_username' }); // ex: group.getCreator()
    Group.belongsToMany(models.User.User, { through: 'UserBans', as: 'BannedUsers' });
    Group.hasMany(models.Event.Event, { as: 'Events' });
}

function addUserToGroup(groupId, user) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.findById(groupId).then(group => {
            if (!group) return reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getUsers({ where: { username: user.username }});
        })
        .then(users => {
            if (users.length !== 0) return reject(new Error('This user is already a part of this group.'));
            return tmpGroup.addUser(user);
        })
        .then(() => { resolve(); });
    });
}

function removeUserFromGroup(groupId, user) {
    return new Promise((resolve, reject) => {
        let tmpGroup;
        Group.findById(groupId).then(group => {
            if (!group) return reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getUsers({ where: { username: user.username }});
        })
        .then(users => {
            if (users.length === 0) return reject(new Error('This user is not part of this group.'));
            return tmpGroup.removeUser(user);
        })
        .then(() => { resolve(); });
    });
}

function banUser(group, user) {
    return new Promise((resolve, reject) => {
        group.getBannedUsers()
        .then(bannedUsers => {
            if (bannedUsers.map(el => el.username).indexOf(user.username) !== -1) return Promise.reject(new Error('This user is already banned.'));
            return group.addBannedUser(user);
        })
        .then(resolve)
        .catch(reject);
    });
}

function createInviteCode(group) {
    return new Promise((resolve, reject) => {
        let tmpInviteCode;
        generateId('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)
        .then(inviteCode => {
            tmpInviteCode = inviteCode;
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            group.invite_code = tmpInviteCode;
            return group.save();
        })
        .then(() => resolve(tmpInviteCode))
        .catch(reject);
    });
}

function unbanUser(group, user) {
    return new Promise((resolve, reject) => {
        group.getBannedUsers()
        .then(bannedUsers => {
            if (bannedUsers.map(el => el.username).indexOf(user.username) === -1) return Promise.reject(new Error('This user is not banned.'));
            return group.removeBannedUser(user);
        })
        .then(resolve)
        .catch(reject);
    });
}

module.exports = { Group, defineModels, addUserToGroup, removeUserFromGroup, banUser, unbanUser, createInviteCode };
