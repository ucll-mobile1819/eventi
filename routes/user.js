const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");
const middleware = require('../middleware');

router.post('/', (req, res, next) => {
    userService.createUser(req.body.firstname, req.body.lastname, req.body.birthday, req.body.username, req.body.password, req.body.passwordConf)
    .then(() => {
        res.send();
    })
    .catch(next);
});

router.get('/:username', middleware.auth.loggedIn, (req, res, next) => {
    userService.getUser(req.user, req.params.username)
    .then(user => {
        res.send(user);
    })
    .catch(next);
});

module.exports = router;
