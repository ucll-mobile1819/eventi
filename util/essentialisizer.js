const clone = obj => JSON.parse(JSON.stringify(obj)); // Also removes all functions

function essentializyGroup(group) {
    const r = clone(group);
    return { id: r.id, name: r.name, description: r.description, color: r.color, creator: r.creator_username };
}

function essentializyUser(user) {
    const r = clone(user);
    return { firstname: r.firstname, lastname: r.lastname, username: r.username, birthday: r.birthday };
}

function essentializyEvent(event) {
    const r = clone(event);
    return { id: r.id, name: r.name, description: r.description, start_time: r.start_time, end_time: r.end_time, address: r.address, location_name: r.location_name, city: r.city, zipcode: r.zipcode, country: r.country };
}

function essentializyComment(comment_creator, comment) {
    const creator = clone(comment_creator);
    const r = clone(comment);
    return { id: r.id, content: r.content, creator: creator.username };
}

module.exports = { essentializyGroup, essentializyUser, essentializyEvent, essentializyComment };