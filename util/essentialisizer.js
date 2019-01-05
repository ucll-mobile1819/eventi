const clone = obj => JSON.parse(JSON.stringify(obj)); // Also removes all functions
const User = require('../models/user');

function essentializyGroup(group, memberCount, showInviteCode = false) {
    return new Promise((resolve) => {
        if (!group) return resolve(null);
        const r = clone(group);
        resolve({ id: r.id, name: r.name, description: r.description, color: r.color, creator: r.creator_username, memberCount, inviteCode: showInviteCode ? r.invite_code : undefined });
    });
}

function essentializyUser(user) {
    return new Promise((resolve) => {
        if (!user) return resolve(null);
        const r = clone(user);
        resolve({ firstname: r.firstname, lastname: r.lastname, username: r.username, birthday: r.birthday });
    });
}

function essentializyEvent(event, currentUsername, votes=null) {
    return new Promise((resolve, reject) => {
        if (!event) return resolve(null);
        const r = clone(event);
        let result;
        Promise.all([ event.getGroup(), event.getCreator(), event.getUserAttendances(), event.getPollDates() ])
        .then(results => Promise.all([ results[0], results[1], results[2], ...results[3].map(el => essentializyPollDate(el)) ]))    
        .then(results => {
            result = { id: r.id, name: r.name, description: r.description, startTime: r.start_time, endTime: r.end_time, address: r.address, locationName: r.location_name, city: r.city, zipcode: r.zipcode, country: r.country, type: r.type };
            if (r.type === 'poll') result.pollDates = results.slice(3);
            results[2].forEach(user => {
                if (user.username === currentUsername) {
                    result.status = user.attendances.status;
                }
            });
            if (!result.status) result.status = 'Pending';
            return Promise.all([ essentializyGroup(results[0]), essentializyUser(results[1]) ]);
        })
        .then(results => {
            result.group = results[0];
            result.creator = results[1];
            if (result.pollDates instanceof Array && votes !== null) {
                result.pollDates.map((e, i) => e.votes = votes.find(el => el.id === e.id).votes);
            }
            resolve(result);
        })
        .catch(reject);
    });
}

function essentializyPollDate(pollDate) {
    return new Promise((resolve) => {
        if (!pollDate) return resolve(null);
        const r = clone(pollDate);
        resolve({ id: r.id, startTime: r.start_time, endTime: r.end_time, votes: r.votes });
    });
}

function essentializyComment(comment) {
    return new Promise((resolve, reject) => {
        const r = clone(comment);
        comment.getCreator()
        .then(creator => essentializyUser(creator))
        .then(creator => {
            resolve({ id: r.id, content: r.content, creator });
        })
        .catch(reject);
    });
}

function essentializyAttendance(attendance) {
    return new Promise((resolve, reject) => {
        const r = clone(attendance);
        User.User.findById(r.user_username)
        .then(user => essentializyUser(user))
        .then(user => {
            return resolve({ status: r.status, user });
        })
        .catch(reject);
    });    
}

module.exports = { essentializyGroup, essentializyUser, essentializyEvent, essentializyPollDate, essentializyComment, essentializyAttendance };
