const connection = require('../models/sequelize-connection').connection;
const Sequelize = require('sequelize');

const Attendance = connection.define('attendances', {
    status: {
        type: Sequelize.ENUM,
        values: ['Going', 'Not going'],
    }
});
  
module.exports = { Attendance };