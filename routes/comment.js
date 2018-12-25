const express = require('express');
const router = express.Router();
const commentService = require("../services/comment-service");
const middleware = require('../middleware');
const essentialisizer = require('../util/essentialisizer');

// get all comments of a user isn't needed?

// get a single comment isn't needed?

router.get('/event/:eventId', middleware.auth.loggedIn, (req, res, next) => {
    commentService.getCommentsOfEvent(req.user, req.params.eventId)
    .then(comments => res.send(comments))
    .catch(next);
})

router.post('/', middleware.auth.loggedIn, (req, res, next) => {
    commentService.createComment(req.user, req.body.eventId, req.body.content)
    .then(result => {
        res.send(result);
    })
    .catch(next);
})

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    commentService.updateComment(req.user, req.params.id, req.body.content)
    .then(comment => res.send(comment))
    .catch(next);
})

router.delete('/:id', middleware.auth.loggedIn, (req, res, next) => {
    commentService.deleteComment(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
})

module.exports = router;