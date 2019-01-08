const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const Event = connection.define('events', { // Dates should all be UTC, conversions done front-end side
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING({length: 5000}),
    description: Sequelize.STRING({length: 5000}),
    start_time: Sequelize.DATE,
    end_time: Sequelize.DATE,
    address: Sequelize.STRING({length: 5000}),
    location_name: Sequelize.STRING({length: 5000}),
    city: Sequelize.STRING,
    zipcode: Sequelize.STRING,
    country: Sequelize.STRING,
    type: {
        type: Sequelize.ENUM,
        values: ['event', 'poll'],
        defaultValue: 'event'
    }
});

function defineModels(items) {
    models = items;
    Event.belongsTo(models.Group.Group);
    Event.belongsTo(models.User.User, { as: 'Creator', constraints: false, foreignKey: 'creator_username' });
    Event.hasMany(models.PollDate.PollDate, { as: 'PollDates', constraints: false, foreignKey: 'event_id' });
    Event.hasMany(models.Comment.Comment, { 
        as: 'Comments',
        constraints: false,
        foreignKey: 'event_id',
    });
    Event.belongsToMany(models.User.User, { as: 'UserAttendances', through: models.Attendance.Attendance });
}

module.exports = { Event, defineModels };