const clone = obj => JSON.parse(JSON.stringify(obj)); // Also removes all functions

function essentializyGroup(group) {
    const r = clone(group);
    return { id: r.id, name: r.name, description: r.description, color: r.color, creator: r.creator_username };
}

function essentializyUser(user) {
    const r = clone(user);
    return { firstname: r.firstname, lastname: r.lastname, username: r.username, birthday: r.birthday };
}

function essentializyEvent(event, pollDates = undefined) {
    const r = clone(event);
    return { id: r.id, name: r.name, description: r.description, startTime: r.start_time, endTime: r.end_time, address: r.address, locationName: r.location_name, city: r.city, zipcode: r.zipcode, country: r.country, type: r.type, pollDates: pollDates };
}

module.exports = { essentializyGroup, essentializyUser, essentializyEvent };