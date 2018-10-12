const express = require('express');
const router = express.Router();
const groupService = require('../services/group-service');
const middleware = require('../middleware');
const essentialisizer = require('../util/essentialisizer');

router.get('/', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getJoinedGroups(req.user)
    .then(groups => {
        if (!groups) res.send([]);
        res.send(groups.map(group => essentialisizer.essentializyGroup(group)));
    })
    .catch(next);
});

router.get('/created', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getCreatedGroups(req.user)
    .then(groups => {
        if (!groups) return res.send([]);
        res.send(groups.map(group => essentialisizer.essentializyGroup(group)));
    })
    .catch(next);
});

router.get('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getGroup(req.user, req.params.id)
    .then(group => {
        if (!group) return res.status(404).send();
        return res.send(essentialisizer.essentializyGroup(group));
    })
    .catch(next);
});

router.get('/:id/members', middleware.auth.loggedIn, (req, res, next) => {
    groupService.getGroupMembers(req.user, req.params.id)
    .then(members => {
        res.send(members.map(member => essentialisizer.essentializyUser(member)));
    })
    .catch(next);
});

router.post('/', middleware.auth.loggedIn, (req, res, next) => {
    groupService.createGroup(req.user, req.body.name, req.body.description, req.body.color)
    .then(() => {
        res.send();
    })
    .catch(next);
});

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.updateGroup(req.user, req.params.id, req.body.name, req.body.description, req.body.color)
    .then(() => {
        res.send();
    })
    .catch(next);
});

router.delete('/:id', middleware.auth.loggedIn, (req, res, next) => {
    groupService.removeGroup(req.user, req.params.id)
    .then(() => {
        res.send();
    })
    .catch(next);
});

router.delete('/:groupId/:username', middleware.auth.loggedIn, (req, res, next) => {
    groupService.removeUserFromGroup(req.user, req.params.username, req.params.groupId)
    .then(() => {
        res.send();
    })
    .catch(next);
});

module.exports = router;