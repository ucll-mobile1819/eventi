const Event = require("../models/event");
const Group = require('../models/group');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

function createEvent(currentUser, groupId, name,description,startDate,endDate,locationName,address,zipcode,city,housenumber){
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
                address,
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

function updateEvent(currentUser, eventId, name, description, startDate, endDate, locationName, address, zipcode, city, housenumber) {
    return new Promise((res, rej) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => Promise.all([ tmpEvent.getCreator(), group.getCreator() ]))
        .then(creators => {
            if (currentUser.username !== creators[0].username && currentUser.username !== creators[1].username)
                return Promise.reject(new Error('Only the group creator and event creator can edit this event.'));
            tmpEvent.name = name;
            tmpEvent.description = description;
            tmpEvent.start_date = startDate;
            tmpEvent.end_date = endDate;
            tmpEvent.location_name = locationName;
            tmpEvent.address = address;
            tmpEvent.zipcode = zipcode;
            tmpEvent.city = city;
            tmpEvent.housenumber = housenumber;
            return tmpEvent.save();
        })
        .then(res)
        .catch(rej);
    });
}

function deleteEvent(currentUser, eventId) {
    return new Promise((res, rej) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => Promise.all([ group.getCreator(), tmpEvent.getCreator() ]))
        .then(creators => {
            if (currentUser.username !== creators[0] && currentUser.username !== creators[1])
                return Promise.reject(new Error('Only the group creator and event creator can delete this event.'));
            // TODO: Remove users who voted / set a status (maybe, no, yes) for this event
            return event.destroy();
        })
        .then(res)
        .catch(rej);
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
        })
        .catch(rej);
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

module.exports = { createEvent, getAllEvents, getEvent, updateEvent, deleteEvent };