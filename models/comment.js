const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const Comment = connection.define('comments', {
    content: Sequelize.STRING
    // datetime is added by Sequelize?
});

function defineModels(items) {
    models = items;
    Comment.belongsTo(models.Event.Event);
}

module.exports = { Comment, defineModels };
