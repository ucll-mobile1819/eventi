const express = require('express');
const router = express.Router();
const groupService = require('../services/group-service');
const middleware = require('../middleware');

router.get('/', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getJoinedGroups(req.user)
    .then(groups => {
        if (!groups) res.send([]);
        res.send(groups);
    })
    .catch(next);
});

router.get('/created', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getCreatedGroups(req.user)
    .then(groups => {
        if (!groups) return res.send([]);
        res.send(groups);
    })
    .catch(next);
});

router.get('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getGroup(req.user, req.params.id)
    .then(group => {
        if (!group) return res.status(404).send();
        return res.send(group);
    })
    .catch(next);
});

router.get('/:id/members', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getGroupMembers(req.user, req.params.id)
    .then(members => {
        res.send(members);
    })
    .catch(next);
});

router.get('/:id/membercount', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getGroupMemberCount(req.user, req.params.id)
    .then(count => res.send({ count }))
    .catch(next);
});

router.get('/:id/banned-users', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getBannedUsers(req.user, req.params.id)
    .then(bannedUsers => res.send(bannedUsers))
    .catch(next);
});

router.post('/', middleware.auth.loggedIn, (req, res, next) => {
    groupService.createGroup(req.user, req.body.name, req.body.description, req.body.color)
    .then(group => res.send(group))
    .catch(next);
});

router.post('/:id/ban/:username', middleware.auth.loggedIn, (req, res, next) => {
    groupService.banUser(req.user, req.params.id, req.params.username)
    .then(() => groupService.getBannedUsers(req.user, req.params.id))
    .then(users => res.send(users))
    .catch(next);
});

router.post('/:id/unban/:username', middleware.auth.loggedIn, (req, res, next) => {
    groupService.unbanUser(req.user, req.params.id, req.params.username)
    .then(() => groupService.getBannedUsers(req.user, req.params.id))
    .then(users => res.send(users))
    .catch(next);
});

router.post('/join/:inviteCode', middleware.auth.loggedIn, (req, res, next) => {
    groupService.joinGroup(req.user, req.params.inviteCode)
    .then(group => res.send(group))
    .catch(next);
});

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.updateGroup(req.user, req.params.id, req.body.name, req.body.description, req.body.color)
    .then(group => res.send(group))
    .catch(next);
});

router.put('/:id/generate-invite-code', middleware.auth.loggedIn, (req, res, next) => {
    groupService.generateInviteCode(req.user, req.params.id)
    .then(inviteCode => res.send({ inviteCode }))
    .catch(next);
});

router.delete('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.removeGroup(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
});

router.delete('/:groupId/:username', middleware.auth.loggedIn, (req, res, next) => {
    groupService.removeUserFromGroup(req.user, req.params.username, req.params.groupId)
    .then(() => res.send())
    .catch(next);
});

module.exports = router;