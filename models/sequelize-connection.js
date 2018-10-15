const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
    }
});

if (process.env.DUMMY) {
    module.exports.informationConnection = new Sequelize('information_schema', process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 1,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

module.exports.connection = sequelize;