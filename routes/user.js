const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");

router.post('/', (req, res, next) => {
    userService.createUser(req.body.firstname, req.body.lastname, req.body.birthday, req.body.username, req.body.password, req.body.passwordConf)
    .then(() => {
        res.send();
    })
    .catch(next);
});

module.exports = router;
