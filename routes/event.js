const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");

router.get('/', (req, res, next) =>{
    eventService.getAllEvents(req.user)
    .then(result => {
        res.send(result);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) =>{
    eventService.getEvent(req.user, req.params.id)
    .then(result => {
        res.send(result);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
    eventService.createEvent(req.user, req.body.groupId, req.body.name,req.body.description,req.body.startDate,req.body.endDate,req.body.locationName,req.body.zipcode,req.body.city,req.body.address,req.body.housenumber)
    .then(result => {
        res.send(result);
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
    eventService.updateEvent(req.user. req.params.id, req.body.name,req.body.description,req.body.startDate,req.body.endDate,req.body.locationName,req.body.zipcode,req.body.city,req.body.address,req.body.housenumber)
    .then(res)
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
    eventService.deleteEvent(req.user, req.params.id)
    .then(() => res.send())
    .catch(next);
});

module.exports = router;
