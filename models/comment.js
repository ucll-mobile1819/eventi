const connection = require('./sequelize-connection').connection;
const Sequelize = require('sequelize');

let models = {};

const Comment = connection.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: Sequelize.STRING({length: 5000})
});

function defineModels(items) {
    models = items;
    Comment.belongsTo(models.Event.Event, {
        constraints: false,
        foreignKey: 'event_id'
    });
    Comment.belongsTo(models.User.User, { 
        as: 'Creator', 
        constraints: false, 
        foreignKey: 'comment_creator' 
    });
}

module.exports = { Comment, defineModels };
