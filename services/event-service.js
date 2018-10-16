const Event = require("../models/event");
const Group = require('../models/group');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

function createEvent(currentUser, groupId, name,description,startDate,endDate,locationName,adress,zipcode,city,housenumber){
    return new Promise((resolve, reject) =>{
        let tmpGroup;
        let tmpEvent;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) {
                return Promise.reject(new Error('This group does not exist.'));
            }
            tmpGroup = group;
            return group.getUsers({ where: { username: currentUser.username } });
        })
        .then(users => {
            if (users.length === 0) {
                return Promise.reject(new Error('You do not belong to this group.'));
            }
            return Event.Event.create({
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                location_name: locationName,
                zipcode,
                city,
                adress,
                housenumber
            });
        }).then((event) => {
            tmpEvent = event;
            return Promise.all([ tmpGroup.addEvent(event), event.setCreator(currentUser) ]);
        })
        .then(() => resolve(tmpEvent))
        .catch(() => {
            reject(new Error("Something went wrong with creating an event"));
        });
    });
}

function getAllEvents(currentUser) {
    return new Promise((res, rej) => {
        currentUser.getGroups()
        .then(groups => {
            let promises = [];
            groups.forEach(group => promises.push(group.getEvents({
                where: { end_date: { [op.gt]: Date.now } }
            })));
            return Promise.all(promises);
        })
        .then(results => {
            results = [].concat.apply([], results);
            res(results);
        });
    });
}

function getEvent(currentUser, eventId) {
    return new Promise((res, rej) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => group.getUsers({ where: { username: currentUser.username } }))
        .then(users => {
            if (users.length === 0) return Promise.reject(new Error('You do not belong to the group of this event.'));
            res(tmpEvent);
        })
        .catch(rej);
    });
}

module.exports = { createEvent, getAllEvents, getEvent };