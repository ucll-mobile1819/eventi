const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");

router.post('/', (req, res) => {
    userService.createUser(req.body.firstname, req.body.lastname, req.body.birthday, req.body.username, req.body.password, req.body.passwordConf)
    .then(() => {
        res.send();
    })
    .catch((error) => {
        res.status(400).send({error: error.message});
    });
});

module.exports = router;
