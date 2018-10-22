const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const PollDate = connection.define('poll_dates', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    start_time: Sequelize.DATE,
    end_time: Sequelize.DATE
});

function defineModels(items) {
    models = items;
    PollDate.belongsTo(models.Event.Event, { as: 'Event', constraints: false, foreignKey: 'event_id' });
}

module.exports = { PollDate, defineModels };