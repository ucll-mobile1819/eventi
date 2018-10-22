const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const Event = connection.define('events', { // Dates should all be UTC, conversions done front-end side
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    start_time: Sequelize.DATE,
    end_time: Sequelize.DATE,
    address: Sequelize.STRING,
    location_name: Sequelize.STRING,
    city: Sequelize.STRING,
    zipcode: Sequelize.STRING,
    country: Sequelize.STRING
});

function defineModels(items) {
    models = items;
    Event.belongsTo(models.Group.Group);
    Event.belongsTo(models.User.User, { as: 'Creator', constraints: false, foreignKey: 'creator_username' });
}

module.exports = { Event, defineModels };