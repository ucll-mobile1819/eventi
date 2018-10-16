const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");
const middleware = require('../middleware');
const essentialisizer = require('../util/essentialisizer');

router.get('/', middleware.auth.loggedIn, (req, res, next) =>{
    eventService.getAllEvents(req.user)
    .then(events => {
        res.send(events.map(el => essentialisizer.essentializyEvent(el)));
    })
    .catch(next);
});

router.get('/:id', middleware.auth.loggedIn,  (req, res, next) =>{
    eventService.getEvent(req.user, req.params.id)
    .then(result => {
        res.send(essentialisizer.essentializyEvent(result));
    })
    .catch(next);
});

router.post('/', middleware.auth.loggedIn,  (req, res, next) => {
    eventService.createEvent(req.user, req.body.groupId, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country)
    .then(result => {
        res.send(essentialisizer.essentializyEvent(result));
    })
    .catch(next);
});

router.put('/:id', middleware.auth.loggedIn, (req, res, next) => {
    eventService.updateEvent(req.user, req.params.id, req.body.name, req.body.description, req.body.startTime, req.body.endTime, req.body.locationName, req.body.zipcode, req.body.city, req.body.address, req.body.country)
    .then(() => res.send())
    .catch(next);
});

router.delete('/:id', middleware.auth.loggedIn,  (req, res, next) => {
    eventService.deleteEvent(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
});

module.exports = router;
