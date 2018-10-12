const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");

router.post('/login', (req, res) => {
    userService.loginUser(req.body.username, req.body.password)
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(400).send({ error: err.message });
    });
});

module.exports = router;
