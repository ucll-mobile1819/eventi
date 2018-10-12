const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const Group = connection.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    color: Sequelize.STRING
});

function defineModels(items) {
    models = items;
    Group.belongsToMany(models.User.User, { through: 'UserGroup' }); // Defines many to many relationship with table in between (also in User model)
    Group.belongsTo(models.User.User, { as: 'Creator', constraints: false, foreignKey: 'creator_username' }); // ex: group.getCreator()
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

module.exports = { Group, defineModels, addUserToGroup, removeUserFromGroup }