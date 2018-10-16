const express = require('express');
const router = express.Router();
const eventService = require("../services/event-service");

router.post('/', (req, res) => {
    eventService.createEvent(req.body.name,req.body.description,req.body.startdate,req.body.enddate,req.body.locationname,req.body.zipcode,req.body.city,req.body.adress,req.body.housenumber)
    .then(result => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send({error: error.message});
    });
});

router.get('/',(req,res) =>{
    eventService.housenumber()
    .then(result => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send({error: error.message});
    });
});

router.get('/:id',(req,res) =>{
    eventService.getAllEvents()
    .then(result => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send({error: error.message});
    });
});


module.exports = router;
