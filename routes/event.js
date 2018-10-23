const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");
const middleware = require('../middleware');
const essentialisizer = require('../util/essentialisizer');

// ?type=[event|poll]
router.get('/', middleware.auth.loggedIn, (req, res, next) =>{
    eventService.getAllEvents(req.user, req.query.type)
    .then(events => {
        res.send(events.map(el => essentialisizer.essentializyEvent(el)));
    })
    .catch(next);
});

router.get('/:id', middleware.auth.loggedIn,  (req, res, next) =>{
    eventService.getEvent(req.user, req.params.id)
    .then(event => {
        if (event.type === 'poll') {
            event.getPollDates()
            .then(pollDates => {
                res.send(essentialisizer.essentializyEvent(result, pollDates));
            })
        } else {
            res.send(essentialisizer.essentializyEvent(result));
        }
    })
    .catch(next);
});

// ?type=[event|poll]
router.get('/group/:groupId', middleware.auth.loggedIn, (req, res, next) => {
    eventService.getAllEventsInGroup(req.user, req.params.groupId, req.query.type)
    .then(events => res.send(events))
    .catch(next);
});

router.post('/', middleware.auth.loggedIn,  (req, res, next) => {
    let promise;
    let params = [req.user, req.body.groupId, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country];
    if (req.body.type === 'poll') {
        promise = eventService.createPoll(...params, req.body.datums);
    } else {
        promise = eventService.createEvent(...params);
    }
    promise.then(result => {
        res.send(essentialisizer.essentializyEvent(result));
    })
    .catch(next);
});

router.post('/:id/end-poll', middleware.auth.loggedIn, (req, res, next) => {
    eventService.endPoll(req.user, req.params.id, req.body.pollDateId)
    .then(() => res.send())
    .catch(next);
});

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    eventService.updateEvent(req.user, req.params.id, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country)
    .then(() => res.send())
    .catch(next);
});

router.delete('/:id', middleware.auth.loggedIn,  (req, res, next) => { // TODO: Also delete user votes
    eventService.deleteEvent(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
});

// TODO: user votes

module.exports = router;
