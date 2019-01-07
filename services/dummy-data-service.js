const sequelize = require('sequelize');
const userService = require('../services/user-service');
const groupService = require('../services/group-service');
const eventService = require('../services/event-service');
const commentService = require('../services/comment-service');

function emptyDatabase(informationConnection, connection) {
    return new Promise((resolve, reject) => {
        console.log('\n\n-----------------------------------------------------------------');
        console.log('\x1b[33m%s\x1b[0m', `Removing all tables from database ${process.env.MYSQL_DATABASE}`);
        console.log('-----------------------------------------------------------------\n\n');
        connection.query('SET FOREIGN_KEY_CHECKS = 0;')
        .then(() => {
            return informationConnection.query(`SELECT concat('ALTER TABLE ', TABLE_NAME, ' DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') as query FROM information_schema.key_column_usage WHERE CONSTRAINT_SCHEMA = '${process.env.MYSQL_DATABASE}' AND referenced_table_name IS NOT NULL;`, { type: sequelize.QueryTypes.SELECT });
        })
        .then(queries => {
            queries = queries.map(el => connection.query(el.query));
            queries.unshift(informationConnection.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${process.env.MYSQL_DATABASE}';`, { type: sequelize.QueryTypes.SELECT }));
            return Promise.all(queries);
        })
        .then(querieResults => {
            let tableNames = querieResults[0];
            if (tableNames.length === 0) return new Promise(a=>a());
            let query = 'DROP TABLE IF EXISTS ' + tableNames[0].table_name;
            for (let i = 1; i < tableNames.length; i++) query += ',' + tableNames[i].table_name;
            query += ';';
            return connection.query(query);
        })
        .then(() => {
            return connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        })
        .then(() => {
            console.log('\n\n-----------------------------------------------------------------');
            console.log('\x1b[32m%s\x1b[0m', `All tables from database ${process.env.MYSQL_DATABASE} have been removed`);
            console.log('-----------------------------------------------------------------\n\n');
            resolve();
        });
    });
}

function generateDummyData() {
    console.log('\n\n-----------------------------------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', 'Generating dummy data');
    console.log('-----------------------------------------------------------------\n\n');

    // OBJECTS TO USE IN MULTIPLE LOCATIONS
    let alice;
    let bob;
    let john;
    let vogels;

    let groupA; // Creator: alice
    let groupB; // Creator: bob
    let groupVogels; // Creator: sirVogels

    let inviteCodeA;
    let inviteCodeB;
    let inviteCodeVogels;

    let eventA1; // Creator: alice
    let eventA2; // Creator: Bob
    let eventB1; // Creator: Bob
    let eventB2; // Creator: Bob
    let eventB3; // Creator: John
    let eventVogels; // Creator: Bob
    let eventVogelsPoll; // Creator: Bob

    // GENERATING USERS
    let reqs = [];
    reqs.push(userService.createUser('Alice', 'Henderson', new Date(1963, 05, 23), 'alice', 't1', 't1', false));
    reqs.push(userService.createUser('Bob', 'Sanders', new Date(1965, 07, 01), 'bob', 't2', 't2', false));
    reqs.push(userService.createUser('John', 'Doe', new Date(1963, 05, 23), 'john', 't3', 't3', false));
    reqs.push(userService.createUser('Frédéric', 'Vogels', new Date(1907, 1, 1), 'sirVogels', '20op20', '20op20', false));
    Promise.all(reqs)
    .then(results => {
        [ alice, bob, john, vogels ] = [ results[0], results[1], results[2], results[3] ];

        // GENERATING GROUPS
        reqs = [];
        reqs.push(groupService.createGroup(alice, 'GroupA', 'Description of group A', '#8BC34A'));
        reqs.push(groupService.createGroup(bob, 'GroupB', 'Description of group B', '#673AB7'));
        reqs.push(groupService.createGroup(vogels, 'JavaScript Fanbase', 'A group of dedicated JavaScript developers.', '#FF5722'));
        return Promise.all(reqs);
    })
    .then(results => {
        [ groupA, groupB, groupVogels ] = [ results[0], results[1], results[2] ];

        // GENERATING INVITE CODES
        return Promise.all([ groupService.generateInviteCode(alice, groupA.id), groupService.generateInviteCode(bob, groupB.id), groupService.generateInviteCode(vogels, groupVogels.id) ]);
    })
    .then(results => {
        inviteCodeA = results[0];
        inviteCodeB = results[1];
        inviteCodeVogels = results[2];

        // MAKING USERS JOIN GROUPS
        return Promise.all([ groupService.joinGroup(bob, inviteCodeA), groupService.joinGroup(john, inviteCodeB), groupService.joinGroup(john, inviteCodeVogels), groupService.joinGroup(bob, inviteCodeVogels) ]);
    })
    .then(() => {
        // CREATING EVENTS
        let e1 = eventService.createEvent(alice, groupA.id, 'A', 'A Desc', new Date(2019, 11, 23, 20, 0, 0), new Date(2019, 11, 24, 4, 0, 0), 'Maximo', 'Straat', '3000', 'Leuven', 'Belgium');
        let e2 = eventService.createEvent(bob, groupA.id, 'B', 'B Desc', new Date(2019, 11, 18, 20, 0, 0), new Date(2019, 11, 24, 4, 0, 0), 'Maximo', 'Straat', '3000', 'Leuven', 'Belgium');
        let pollDates = [ 
            { startTime: new Date(2019, 1, 23, 13, 00, 00), endTime: new Date(2019, 1, 23, 15, 00, 00) },
            { startTime: new Date(2019, 1, 23, 15, 00, 00), endTime: new Date(2019, 1, 23, 17, 00, 00) },
            { startTime: new Date(2019, 1, 23, 17, 00, 00), endTime: new Date(2019, 1, 23, 19, 00, 00) },
            { startTime: new Date(2019, 1, 23, 10, 30, 00), endTime: new Date(2019, 1, 23, 12, 30, 00) },
            { startTime: new Date(2019, 1, 23, 13, 30, 00), endTime: new Date(2019, 1, 23, 15, 30, 00) },
        ];
        let e3 = eventService.createPoll(bob, groupB.id, 'C', 'C Desc', null, null, 'Maximo', 'Straat', '3000', 'Leuven', 'Belgium', pollDates);
        let e4 = eventService.createEvent(bob, groupB.id, 'D', 'D Desc', new Date(2019, 7, 23, 20, 0, 0), new Date(2019, 11, 24, 4, 0, 0), 'Maximo', 'Straat', '3000', 'Leuven', 'Belgium');
        let e5 = eventService.createEvent(john, groupB.id, 'E', 'E Desc', new Date(2019, 7, 23, 20, 0, 0), new Date(2019, 7, 24, 4, 0, 0), 'Maximo', 'Straat', '3000', 'Leuven', 'Belgium');
        let e6 = eventService.createEvent(vogels, groupVogels.id, 'JavaScript GraphQL workshop', 'A workshop introducing us to GraphQL. We\'ll also be making an API and small front-end to implement this technology.', new Date(2019, 0, 9, 16), new Date(2019, 0, 9, 19), 'UCLL C0.01', 'UCLL Campus Proximus', '', '', '', 'event', false);
        let e7 = new Promise((res, rej) => { setTimeout(() => eventService.createPoll(vogels, groupVogels.id, 'Node.js tips and tricks', 'Things you didn\'t know about node.js and how to use them.', null, null, 'UCLL C0.02', 'UCLL Campus Proximus', '', '', '', [
            { startTime: new Date(2019, 0, 11, 13, 00, 00), endTime: new Date(2019, 0, 11, 15, 00, 00) },
            { startTime: new Date(2019, 0, 11, 15, 00, 00), endTime: new Date(2019, 0, 11, 17, 00, 00) },
            { startTime: new Date(2019, 0, 11, 17, 00, 00), endTime: new Date(2019, 0, 11, 19, 00, 00) },
            { startTime: new Date(2019, 0, 11, 10, 30, 00), endTime: new Date(2019, 0, 11, 12, 30, 00) },
            { startTime: new Date(2019, 0, 11, 18, 30, 00), endTime: new Date(2019, 0, 11, 20, 30, 00) },
        ]).then(res).catch(rej), 500); });
        return Promise.all([ e1, e2, e3, e4, e5, e6, e7 ]);
    })
    .then(events => {
        eventA1 = events[0];
        eventA2 = events[1];
        eventB1 = events[2];
        eventB2 = events[3];
        eventB3 = events[4];
        eventVogels = events[5];
        eventVogelsPoll = events[6];
        // VOTE ON EVENT
        let promises = [];
        promises.push(eventService.votePoll(bob, eventB1.id, [ 1, 3 ]));
        promises.push(eventService.votePoll(john, eventB1.id, [ 3 ]));
        promises.push(eventService.votePoll(john, eventVogelsPoll.id, [ 7, 9 ]));
        
        // ADDING COMMENTS TO EVENTS
        promises.push(commentService.createComment(alice, eventA1.id, "I'm definitely coming!"));
        promises.push(commentService.createComment(alice, eventA1.id, "And doing lots of shots, so i can end up in a bush"));
        promises.push(commentService.createComment(bob, eventB1.id, "I can't come, sorry"));
        promises.push(commentService.createComment(bob, eventB1.id, "I'll make up for it another time..."));
        promises.push(commentService.createComment(john, eventB1.id, "Sad :c"));
        promises.push(commentService.createComment(bob, eventVogels.id, 'I love this idea, I\'ll be there!'));
        promises.push(commentService.createComment(john, eventVogels.id, 'I can\'t come to this event, have a meeting :/'));
        promises.push(commentService.createComment(bob, eventVogels.id, 'That\'s too bad, what about the node.js tips and tricks?'));
        promises.push(commentService.createComment(john, eventVogels.id, 'I\'ll be there!'));
        promises.push(commentService.createComment(john, eventVogelsPoll.id, 'Fun fun fun'));
        promises.push(commentService.createComment(bob, eventVogelsPoll.id, 'I know right! :)'));

        // ADDING EVENT ATTENDANCES
        promises.push(eventService.setEventAttendance(alice, eventA1.id, 'Not going'));
        promises.push(eventService.setEventAttendance(bob, eventA1.id, 'Going'));
        promises.push(eventService.setEventAttendance(alice, eventA2.id, 'Going'));
        promises.push(eventService.setEventAttendance(bob, eventA2.id, 'Going'));
        promises.push(eventService.setEventAttendance(bob, eventB1.id, 'Going'));
        promises.push(eventService.setEventAttendance(john, eventB1.id, null));
        promises.push(eventService.setEventAttendance(john, eventB3.id, 'Going'));
        promises.push(eventService.setEventAttendance(john, eventVogels.id, 'Not going'));
        promises.push(eventService.setEventAttendance(bob, eventVogels.id, 'Going'));
        promises.push(eventService.setEventAttendance(john, eventVogelsPoll.id, 'Going'));
        promises.push(eventService.setEventAttendance(bob, eventVogelsPoll.id, 'Going'));

        return Promise.all(promises);
    })
    .then(() => {
        // END OF DUMMY DATA CREATION
        console.log('\n\n\n\n\nUsers created:\nfirstname lastname - username - password \n\nAlice Henderson - alice - t1\nBob Sanders - bob - t2\nJohn Doe - john - t3\nFrédéric Vogels - sirVogels - 20op20');
    }).catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'Error creating dummy data:');
        console.log(err);
    });
}

module.exports = { emptyDatabase, generateDummyData };