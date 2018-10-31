const clone = obj => JSON.parse(JSON.stringify(obj)); // Also removes all functions

function essentializyGroup(group) {
    return new Promise((resolve) => {
        if (!group) return resolve(null);
        const r = clone(group);
        resolve({ id: r.id, name: r.name, description: r.description, color: r.color, creator: r.creator_username });
    });
}

function essentializyUser(user) {
    return new Promise((resolve) => {
        if (!user) return resolve(null);
        const r = clone(user);
        resolve({ firstname: r.firstname, lastname: r.lastname, username: r.username, birthday: r.birthday });
    });
}

function essentializyEvent(event) {
    return new Promise((resolve, reject) => {
        if (!event) return resolve(null);
        const r = clone(event);
        let result;
        Promise.all([ event.getGroup(), event.getCreator(), event.getPollDates() ])
        .then(results => Promise.all([ results[0], results[1], ...results[2].map(el => essentializyPollDate(el)) ]))    
        .then(results => {
            result = { id: r.id, name: r.name, description: r.description, startTime: r.start_time, endTime: r.end_time, address: r.address, locationName: r.location_name, city: r.city, zipcode: r.zipcode, country: r.country, type: r.type };
            if (r.type === 'poll') result.pollDates = results.slice(2);
            return Promise.all([ essentializyGroup(results[0]), essentializyUser(results[1]) ]);
        })
        .then(results => {
            result.group = results[0];
            result.creator = results[1];
            resolve(result);
        })
        .catch(reject);
    });
}

function essentializyPollDate(pollDate) {
    return new Promise((resolve) => {
        if (!pollDate) return resolve(null);
        const r = clone(pollDate);
        resolve({ id: r.id, startTime: r.start_time, endTime: r.end_time });
    });
}

module.exports = { essentializyGroup, essentializyUser, essentializyEvent, essentializyPollDate };