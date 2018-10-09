const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

// Defines user model & links it to database
const User = connection.define('users', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    birthday: Sequelize.DATE,
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    password: Sequelize.STRING
});

module.exports = {
    User
}