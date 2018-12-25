const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");
const middleware = require('../middleware');

// ?type=[event|poll]
router.get('/', middleware.auth.loggedIn, (req, res, next) =>{
    eventService.getAllEvents(req.user, req.query.type)
    .then(events => res.send(events))
    .catch(next);
});

router.get('/:id', middleware.auth.loggedIn,  (req, res, next) =>{
    eventService.getEvent(req.user, req.params.id)
    .then(event => res.send(event))
    .catch(next);
});

router.get('/:id/votes', middleware.auth.loggedIn, (req, res, next) => {
    eventService.getVotes(req.user, req.params.id)
    .then(votes => res.send(votes))
    .catch(next);
});

// ?type=[event|poll]
router.get('/group/:groupId', middleware.auth.loggedIn, (req, res, next) => {
    eventService.getAllEventsInGroup(req.user, req.params.groupId, req.query.type)
    .then(events => res.send(events))
    .catch(next);
});

router.get('/:id/attendance', middleware.auth.loggedIn, (req, res, next) => {
    eventService.getEventAttendance(req.user, req.params.id)
    .then(attendance => res.send(attendance))
    .catch(next);
});

router.get('/:id/attendances', middleware.auth.loggedIn, (req, res, next) => {
    eventService.getEventAttendances(req.user, req.params.id)
    .then(attendances => res.send(attendances))
    .catch(next);
});

// Requires 'type' (and if poll: 'pollDates' => [{startTime:x, endTime:y}])
router.post('/', middleware.auth.loggedIn,  (req, res, next) => {
    let promise;
    let params = [req.user, req.body.groupId, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country];
    if (req.body.type === 'poll') {
        promise = eventService.createPoll(...params, req.body.pollDates);
    } else {
        promise = eventService.createEvent(...params);
    }
    promise.then(result => res.send(result))
    .catch(next);
});

router.post('/:id/end-poll', middleware.auth.loggedIn, (req, res, next) => {
    eventService.endPoll(req.user, req.params.id, req.body.pollDateId)
    .then(event => res.send(event))
    .catch(next);
});

// Body: pollDateIds: [id1, id2, ...]
router.post('/:id/vote', middleware.auth.loggedIn, (req, res, next) => {
    eventService.votePoll(req.user, req.params.id, req.body.pollDateIds)
    .then(() => eventService.getVotes(req.user, req.params.id))
    .then(votes => res.send(votes))
    .catch(next);
});

// Body: state: null|'going'|'not going'
router.post('/:id/attendance', middleware.auth.loggedIn, (req, res, next) => {
    eventService.setEventAttendance(req.user, req.params.id, req.body.state)
    .then(() => eventService.getEventAttendances(req.user, req.params.id))
    .then(attendances => res.send(attendances))
    .catch(next);
});

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    eventService.updateEvent(req.user, req.params.id, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country)
    .then(event => res.send(event))
    .catch(next);
});

router.delete('/:id', middleware.auth.loggedIn,  (req, res, next) => { 
    eventService.deleteEvent(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
});

module.exports = router;
