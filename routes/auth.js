const express = require('express');
const router = express.Router();
const userService = require("../services/user-service");

router.post('/login', (req, res, next) => {
    userService.loginUser(req.body.username, req.body.password)
    .then(result => {
        res.send(result);
    })
    .catch(next);
});

module.exports = router;
