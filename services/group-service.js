const User = require('../models/user');
const Group = require('../models/group');

function createGroup(name, description, color) {

}

function updateGroup(groupId, name, description, color) {
    // Check permissions
}

function removeGroup(groupId) {
    // Check permissions
}

function getGroup(groupId) {
    // Check permissions
}

function addUserToGroup(userId, groupId) {
    // Check permissions
}

function removeUserFromGroup(userId, groupId) {
    // Check permissions
}

function getJoinedGroups() {

}

module.exports = { createGroup, updateGroup, removeGroup, getGroup, addUserToGroup, removeUserFromGroup, getJoinedGroups };