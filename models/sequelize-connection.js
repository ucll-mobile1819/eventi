const Sequelize = require('sequelize');
let sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
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

sequelize.options.define.freezeTableName = true;
sequelize.options.define.underscored = true;
sequelize.options.define.underscoredAll = true;

if (process.env.DUMMY) {
    let informationConnection = new Sequelize('information_schema', process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
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
    
    informationConnection.options.define.freezeTableName = true;
    informationConnection.options.define.underscored = true;
    informationConnection.options.define.underscoredAll = true;

    module.exports.informationConnection = informationConnection;
}

module.exports.connection = sequelize;