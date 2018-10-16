const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");

router.post('/', (req, res, next) => {
    eventService.createEvent(req.user, req.body.groupId, req.body.name,req.body.description,req.body.startDate,req.body.endDate,req.body.locationName,req.body.zipcode,req.body.city,req.body.adress,req.body.housenumber)
    .then(result => {
        res.send(result);
    })
    .catch(next);
});

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


module.exports = router;
