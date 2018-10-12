const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");
const middleware = require('../middleware');
const essentialisizer = require('../util/essentialisizer');

router.post('/', (req, res) => {
    userService.createUser(req.body.firstname, req.body.lastname, req.body.birthday, req.body.username, req.body.password, req.body.passwordConf)
    .then(() => {
        res.send();
    })
    .catch((error) => {
        res.status(400).send({error: error.message});
    });
});

router.get('/:username', middleware.auth.loggedIn, (req, res) => {
    userService.getUser(req.user, req.params.username)
    .then(user => {
        res.send(essentialisizer.essentializyUser(user));
    })
    .catch(next);
});

module.exports = router;
