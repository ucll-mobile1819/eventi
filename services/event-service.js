const Event = require("../models/event");
const Group = require('../models/group');
const Sequelize = require('sequelize');
const PollDate = require('../models/poll-date');
const essentialisizer = require('../util/essentialisizer');
const op = Sequelize.Op;

const trimStrings = strings => strings.map(el => typeof el === 'string' ? el.trim() : el);

function createEvent(currentUser, groupId, name, description, startTime, endTime, locationName, address, zipcode, city, country, type = 'event', essentializyResponse = true) {
    return new Promise((resolve, reject) =>{
        [ name, description, locationName, address, zipcode, city, country ] = trimStrings([ name, description, locationName, address, zipcode, city, country ]);
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
            return Promise.all([ tmpEvent.setGroup(tmpGroup), event.setCreator(currentUser) ]);
        })
        .then(() => (essentializyResponse ? essentialisizer.essentializyEvent(tmpEvent, currentUser.username) : tmpEvent))
        .then(resolve)
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
        createEvent(currentUser, groupId, name, description, startTime, endTime, locationName, address, zipcode, city, country, 'poll', false)
        .then(event => {
            tmpEvent = event;
            let promises = pollDates.map(el => PollDate.PollDate.create({ start_time: el.startTime, end_time: el.endTime }));
            return Promise.all(promises);
        })
        .then(pollDates => tmpEvent.setPollDates(pollDates))
        .then(() => essentialisizer.essentializyEvent(tmpEvent, currentUser.username))
        .then(resolve)
        .catch(reject);
    });
}

function updateEvent(currentUser, eventId, name, description, startTime, endTime, locationName, address, zipcode, city, country) {
    return new Promise((res, rej) => {
        [ name, description, locationName, address, zipcode, city, country ] = trimStrings([ name, description, locationName, address, zipcode, city, country ]);
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
        .then(() => essentialisizer.essentializyEvent(tmpEvent, currentUser.username))
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
        .then(group => Promise.all([ group.getCreator(), tmpEvent.getCreator(), tmpEvent.setUserAttendances([]), removeComments(tmpEvent) ]))
        .then(creators => {
            if (currentUser.username !== creators[0].username && currentUser.username !== creators[1].username)
                return Promise.reject(new Error('Only the group creator and event creator can delete this event.'));
            if (tmpEvent.type === 'poll') {
                return new Promise((resolve, reject) => {
                    removePollDates(tmpEvent)
                    .then(() => tmpEvent.destroy())
                    .then(resolve)
                    .catch(reject);
                });
            } else {
                return tmpEvent.destroy();
            }
        })
        .then(() => res())
        .catch(rej);
    });
}

function removePollDates(event) {
    return new Promise((resolve, reject) => {
        event.getPollDates()
        .then(pollDates => {
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

function removeComments(event) {
    return new Promise((resolve, reject) => {
        event.getComments()
        .then(comments => Promise.all(comments.map(el => el.destroy())))
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
                    [op.or]: [
                        { end_time: { [op.gt]: new Date() } },
                        { end_time: { [op.eq]: null } },
                    ],
                    ...typeQuery
                }
            })));
            return Promise.all(promises);
        })
        .then(results => {
            results = [].concat.apply([], results);
            return Promise.all(results.map(el => essentialisizer.essentializyEvent(el, currentUser.username)));
        })
        .then(res)
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
        .then(events => Promise.all(events.map(el => essentialisizer.essentializyEvent(el, currentUser.username))))
        .then(res)
        .catch(rej);
    });
}

function getEvent(currentUser, eventId, essentializyResponse = true, addVotes = true) {
    return new Promise((res, rej) => {
        let tmpEvent;
        let getVotesFunc = () => addVotes ? getVotes(currentUser, eventId) : null;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            tmpEvent = event;
            return event.getGroup();
        })
        .then(group => Promise.all([ group.getUsers({ where: { username: currentUser.username } }), getVotesFunc() ]))
        .then(results => {
            if (results[0].length === 0) return Promise.reject(new Error('You do not belong to the group of this event.'));
            return essentializyResponse ? essentialisizer.essentializyEvent(tmpEvent, currentUser.username, results[1]) : tmpEvent;
        })
        .then(res)
        .catch(rej);
    });
}

function getVotes(currentUser, eventId) {
    return new Promise((resolve, reject) => {
        getEvent(currentUser, eventId, false, false)
        .then(event => {
            if (event.type !== 'poll') return Promise.reject(new Error('This event is not a poll.'));
            return event.getPollDates();
        })
        .then(pollDates => Promise.all([ pollDates, ...pollDates.map(el => el.getUsers()) ])) // ... spreads an array to a bunch of individual elements (pulls them out of the array)
        // Fun fact: Next line does the exact same as the line underneath, explanation: https://davidwalsh.name/spread-operator
        // .then(([ pollDates, ...pollDateUsers ]) => Promise.all([ pollDateUsers, ...pollDates.map(el => essentialisizer.essentializyPollDate(el)) ]))
        .then(results =>  Promise.all([ results.slice(1), ...results[0].map(el => essentialisizer.essentializyPollDate(el)) ]))
        .then(results => {
            let res = results.slice(1);
            results[0].forEach((el, index) => {
                res[index].votes = el.length;
            });
            resolve(res);
        })
        .catch(reject);
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
            if (pollDates.length === 0) return Promise.reject(new Error('The poll date does not exist / belong to the poll.'));
            let pollDate = pollDates[0];
            tmpEvent.start_time = pollDate.start_time;
            tmpEvent.end_time = pollDate.end_time;
            tmpEvent.type = 'event';
            return Promise.all([ tmpEvent.save(), removePollDates(tmpEvent) ]);
        })
        .then(() => essentialisizer.essentializyEvent(tmpEvent, currentUser.username))
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
            if (event.type !== 'poll') return Promise.reject(new Error('This event is not a poll.'));
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

function getEventAttendances(currentUser, eventId) {
    return new Promise((resolve, reject) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist'));
            tmpEvent = event;
            return belongsToGroup(currentUser, event);
        })
        .then(belongsToGroup => {
            if (!belongsToGroup) return Promise.reject('You do not belong to the group of this event.');
            return tmpEvent.getUserAttendances();
        })
        .then(attendances => Promise.all(attendances.map(el => essentialisizer.essentializyAttendance(el.attendances))))
        .then(resolve)
        .catch(reject);
    });
}

function getEventAttendance(currentUser, eventId) {
    return new Promise((resolve, reject) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist'));
            tmpEvent = event;
            return belongsToGroup(currentUser, event);
        })
        .then(belongsToGroup => {
            if (!belongsToGroup) return Promise.reject('You do not belong to the group of this event.');
            return tmpEvent.getUserAttendances();
        })
        .then(attendances => {
            let attendance = null;
            attendances.forEach(a => {
                if (a.attendances.user_username === currentUser.username) attendance = a.attendances;
            });
            return (attendance ? essentialisizer.essentializyAttendance(attendance) : null);
        })
        .then(resolve)
        .catch(reject);
    });
}

// State: going, not going or null/undefined
function setEventAttendance(currentUser, eventId, state) {
    return new Promise((resolve, reject) => {
        let tmpEvent;
        Event.Event.findById(eventId)
        .then(event => {
            if (!event) return Promise.reject(new Error('This event does not exist.'));
            tmpEvent = event;
            return belongsToGroup(currentUser, event);
        })
        .then(belongsToGroup => {
            if (!belongsToGroup) return Promise.reject(new Error('You do not belong to the group of this event.'));
            state = (!state ? '' : state.toString().toLowerCase().trim());
            let status = (state !== 'going' && state !== 'not going' ? false : state);
            if (status === false) {
                return tmpEvent.removeUserAttendance(currentUser);
            } else {
                return tmpEvent.addUserAttendance(currentUser, { through: { status: (status === 'going' ? 'Going' : 'Not going') } });
            }
        })
        .then(() => resolve())
        .catch(reject);
    });
}

function belongsToGroup(user, event) {
    return new Promise((resolve, reject) => {
       if (!event) return resolve(false);
        event.getGroup()
        .then(group => group.getUsers())
        .then(users => resolve(users.map(el => el.username).indexOf(user.username) !== -1))
        .catch(reject);
    });
}

module.exports = { createEvent, createPoll, getAllEvents, getAllEventsInGroup, getEvent, updateEvent, deleteEvent, endPoll, votePoll, getVotes, setEventAttendance, getEventAttendances, getEventAttendance };