const sequelize = require('sequelize');
const userService = require('../services/user-service');
const groupService = require('../services/group-service');

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

    let groupA;
    let groupB;

    // GENERATING USERS
    let reqs = [];
    reqs.push(userService.createUser('Alice', 'Henderson', new Date(1963, 05, 23), 'alice', 't1', 't1'));
    reqs.push(userService.createUser('Bob', 'Sanders', new Date(1965, 07, 01), 'bob', 't2', 't2'));
    reqs.push(userService.createUser('John', 'Doe', new Date(1963, 05, 23), 'john', 't3', 't3'));
    Promise.all(reqs)
    .then(results => {
        [ alice, bob, john ] = [ results[0], results[1], results[2] ];

        // GENERATING GROUPS
        reqs = [];
        reqs.push(groupService.createGroup(alice, 'GroupA', 'Description of group A', '555555'));
        reqs.push(groupService.createGroup(bob, 'GroupB', 'Description of group B', '121212'));
        return Promise.all(reqs);
    })
    .then(results => {
        [ groupA, groupB ] = [ results[0], results[1] ];

        // GENERATING INVITE CODES (Waiting for merge request approval)
        return new Promise(a=>a());
    })
    .then(() => {
        // MAKING USERS JOIN GROUPS (Waiting for merge request approval)
        return new Promise(a=>a());
    }).then(() => {
        // END OF DUMMY DATA CREATION
        console.log('\n\n\n\n\nUsers created:\nfirstname lastname - username - password \n\nAlice Henderson - alice - t1\nBob Sanders - bob - t2\nJohn Doe - john - t3');
    });
}

module.exports = { emptyDatabase, generateDummyData };