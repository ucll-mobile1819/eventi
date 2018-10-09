const express = require('express');
const router = express.Router();
const middleware = require('../middleware');

router.get('/', (req, res) => {
    res.status(200).send({
        version: '0.0.1',
        time: new Date()
    });
});

module.exports = router;