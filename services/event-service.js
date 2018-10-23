const Event = require("../models/event");
const Group = require('../models/group');
const Sequelize = require('sequelize');
const PollDate = require('../models/poll-date');
const op = Sequelize.Op;

function createEvent(currentUser, groupId, name, description, startTime, endTime, locationName, address, zipcode, city, country, type = 'event') {
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
                start_time: startTime,
                end_time: endTime,
                location_name: locationName,
                zipcode,
                city,
                address,
                country,
                type
            });
        }).then((event) => {
            tmpEvent = event;
            return Promise.all([ tmpGroup.addEvent(event), event.setCreator(currentUser) ]);
        })
        .then(() => resolve(tmpEvent))
        .catch(reject);
    });
}

function createPoll(currentUser, groupId, name, description, startTime, endTime, locationName, address, zipcode, city, country, pollDates) {
    return new Promise((resolve, reject) => {
        let correct = true;
        pollDates.forEach(item => {
            if (!item || !item.startTime || !item.endTime) correct = false;
        });
        if (!correct) return Promise.reject(new Error('All pollDates must have a startTime and endTime attribute.'));
        let tmpEvent;
        createEvent(currentUser, groupId, name, description, startTime, endTime, locationName, address, zipcode, city, country, 'poll')
        .then(event => {
            tmpEvent = event;
            let promises = pollDates.map(el => PollDate.PollDate.create({ start_time: el.startTime, end_time: el.endTime }));
            return Promise.all(promises);
        })
        .then(pollDates => tmpEvent.setPollDates(pollDates))
        .then(resolve)
        .catch(reject);
    });
}

function updateEvent(currentUser, eventId, name, description, startTime, endTime, locationName, address, zipcode, city, country) {
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
            tmpEvent.start_time = startTime;
            tmpEvent.end_time = endTime;
            tmpEvent.location_name = locationName;
            tmpEvent.address = address;
            tmpEvent.zipcode = zipcode;
            tmpEvent.city = city;
            tmpEvent.country = country;
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
            if (currentUser.username !== creators[0].username && currentUser.username !== creators[1].username)
                return Promise.reject(new Error('Only the group creator and event creator can delete this event.'));
            // TODO: Remove users who set a status (maybe, no, yes) for this event
            if (tmpEvent.type === 'poll') {
                return new Promise((resolve, reject) => {
                    Promise.all([ tmpEvent.setPollDates([]), removePollDates(tmpEvent) ])
                    .then(() => tmpEvent.destroy())
                    .then(resolve)
                    .catch(reject);
                });
            } else {
                return tmpEvent.destroy();
            }
        })
        .then(res)
        .catch(rej);
    });
}

function removePollDates(event) {
    return new Promise((resolve, reject) => {
        event.getPollDates(pollDates => {
            let promises = pollDates.map(el => el.setUsers([]));
            return Promise.all([pollDates, ...promises ]);
        })
        .then(results => {
            return Promise.all(results[0].map(el => el.destroy()));
        })
        .then(() => resolve())
        .catch(reject);
    });
}

function getAllEvents(currentUser, type) {
    return new Promise((res, rej) => {
        const typeQuery = (type === 'event' || type === 'poll' ? { type } : null );
        currentUser.getGroups()
        .then(groups => {
            let promises = [];
            groups.forEach(group => promises.push(group.getEvents({
                where: { 
                    end_time: { [op.gt]: new Date() },
                    ...typeQuery
                }
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

function getAllEventsInGroup(currentUser, groupId, type) {
    return new Promise((res, rej) => {
        const typeQuery = (type === 'event' || type === 'poll' ? { type } : null );
        let tmpGroup;
        Group.Group.findById(groupId)
        .then(group => {
            if (!group) return Promise.reject(new Error('This group does not exist.'));
            tmpGroup = group;
            return group.getUsers();
        })
        .then(users => {
            if (users.map(el => el.username).indexOf(currentUser.username) === -1)
                return Promise.reject(new Error('You are not a part of this group.'));
            return tmpGroup.getEvents({ where: { ...typeQuery } });
        })
        .then(res)
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

function endPoll(currentUser, eventId, pollDateId) {
    return new Promise((resolve, reject) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This poll does not exist.'));
            if (event.type !== 'poll') return Promise.reject(new Error('This event is not a poll.'));
            tmpEvent = event;
            return event.getCreator();
        })
        .then(creator => {
            if (creator.username !== currentUser.username) return Promise.reject(new Error('Only the owner of the poll can end it.'));
            return tmpEvent.getPollDates({ where: { id: pollDateId } });
        })
        .then(pollDates => {
            if (pollDates.length === -1) return Promise.reject(new Error('The poll date does not exist / belong to the poll.'));
            let pollDate = pollDates[0];
            tmpEvent.start_time = pollDate.start_time;
            tmpEvent.end_time = pollDate.end_time;
            tmpEvent.type = 'event';
            return Promise.all([ tmpEvent.save(), removePollDates(tmpEvent) ]);
        })
        .then(resolve)
        .catch(reject);
    });
}

// Phew this was a difficult one
function votePoll(currentUser, eventId, pollDates) {
    return new Promise((resolve, reject) => {
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            return Promise.all([ event.getPollDates(), event.getGroup() ]);
        })
        .then(results => {
            let ids = results[0].map(el => el.id);
            let err = false;
            pollDates.forEach(id => {
                if (ids.indexOf(id) === -1) err = true;
            });
            if (err) return Promise.reject(new Error('One or more given poll dates do not belong to this event.'));
            return Promise.all([ results[1].getUsers(), results[0] ]); // You can also add normal objects, such as results[0]
        })
        .then(results => {
            if (results[0].map(el => el.username).indexOf(currentUser.username) === -1)
                return Promise.reject(new Error('You have to be a part of the group to vote on this event.'));

            let promises = [];
            // Add/remove votes
            results[1].forEach(item => {
                let pos = pollDates.indexOf(item.id);
                if (pos !== -1) {
                    promises.push(new Promise((resolve, reject) => {
                        item.getUsers({ where: { username: currentUser.username } })
                        .then(users => {
                            if (users.length !== 0) return resolve();
                            item.addUser(currentUser).then(() => resolve()).catch(reject);
                        })
                        .catch(reject);
                    }));
                } else {
                    promises.push(item.removeUser(currentUser));
                }
            });
            return Promise.all(promises);
        })
        .then(() => resolve())
        .catch(reject);
    });
}

module.exports = { createEvent, createPoll, getAllEvents, getAllEventsInGroup, getEvent, updateEvent, deleteEvent, endPoll, votePoll };