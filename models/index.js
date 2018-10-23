/*
 * HOW TO WRITE MODELS:
 * Define your models by requiring sequelize-connection at runtime and using connection.define()
 * The ModelName variable must be PascalCase and the filename is the exact same except lowercase and split up with '-' => model-name (required for model loader)
 * The table names are plural and with underscores => model_names
 * Do NOT require other models inside a model, use the defineModels(models) function and assign it to a global variable inside the scripts
 * Do NOT specify associations at runtime, place them inside the function defineModels(models) and export this function
 */

const sequelize = require('./sequelize-connection').connection;
const dummyDataService = require('../services/dummy-data-service');
const models = {};
const modules = [];

sequelize.options.define.freezeTableName = true;
sequelize.options.define.underscored = true;
sequelize.options.define.underscoredAll = true;

const loadModels = () => {
    return new Promise((resolve) => {
        require('fs').readdirSync(__dirname).forEach(function(file) {
            if (file === 'index.js') return;
            if (file.split('.').length !== 2) return;
            const mod = require('./' + file);
            let modelName = file.split('.')[0];
            modelName = modelName.split('-').map(n => n.charAt(0).toUpperCase() + n.substring(1)).join('');
            models[modelName] = mod;
            modules.push(mod);
        });
    
        modules.forEach(mod => { if (mod.defineModels) mod.defineModels(models); });
    
        sequelize.sync().then(resolve);
    });
}

if (process.env.DUMMY && process.env.DUMMY.toUpperCase().trim() === 'CREATE') {
    dummyDataService.emptyDatabase(require('./sequelize-connection').informationConnection, sequelize)
    .then(() => {
        return loadModels();
    })
    .then(() => {
        dummyDataService.generateDummyData();
    });
} else {
    loadModels();
}

module.exports = {};

// Example model:
/*
const Sequelize = require('sequelize');
const connection = require('./sequelize-connection').connection;
const bcrypt = require('../auth/bcrypt');
const CustomError = require('../util/custom-error');
const shortid = require("shortid-36")

let models = {};

// Defines user model & links it to database
const User = connection.define('users', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: () => shortid.generate()
    },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    birthday: Sequelize.DATE,
    password: Sequelize.STRING,
    state: {
        type: Sequelize.ENUM('NEW', 'VERIFIED'),
        defaultValue: 'NEW'
    },
    policy_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    google_id: Sequelize.STRING,
    facebook_id: Sequelize.STRING
});

function defineModels(val) { // Define relationships in this function
    models = val;
    // Example for many-to-many relationships:
    User.belongsToMany(models.Role.Role, { through: 'user_role'});
    User.hasMany(models.ShippingAddress.ShippingAddress, { as: 'ShippingAddresses' , onDelete: 'cascade' });
}





function createCustomUser(firstName, lastName, email, birthday, password = null, passwordConfirmation = null) {
    return new Promise((resolve, reject) => {
        User.findOne({ where: {
            email: email
        }})
        .then(user => {
            if (user === null) {
                // User does not exist yet => create new

                // Get possible user input errors, if count > 0, return errors to the user and do not add user to database
                let errors = getRegistrationErrors(firstName, lastName, email, birthday, password, passwordConfirmation);
                if (Object.keys(errors.valueErrors).length > 0) return reject(errors);

                // Salt & hash password and save new user to database with protected password
                bcrypt.securePassword(password)
                .then(hash => User.create({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        birthday: birthday,
                        password: hash}))
                .then(user => resolve(user))
                .catch(error => reject(error));
            } else {
                // User already exists

                if (user.state === 'VERIFIED') {
                    return reject({ error: 'This account already exists.', valueErrors: { } });
                } else {
                    // Account hasn't been verified yet (through email), so act as if the user didn't exist
                    // Or account was already created through google or facebook, which defaults to a NEW state

                    // Secure password, then update user with new info
                    bcrypt.securePassword(password)
                    .then(hash => {
                        // Check user input data for errors
                        let errors = getRegistrationErrors(firstName, lastName, email, birthday, password, passwordConfirmation);
                        if (Object.keys(errors.valueErrors).length > 0) return Promise.reject(errors);

                        user.password = hash; // update password

                        // If user data is empty (due to empty received data from google/facebook authentication for example), update with new sent data
                        if (user.first_name === null || user.first_name === '') user.first_name = firstName;
                        if (user.last_name === null || user.last_name === '') user.last_name = lastName;
                        if (user.birthday === null) user.birthday = birthday;
                        return user.save();
                    })
                    .then(() => resolve(user))
                    .catch(error => reject(error));
                }
            }
        })
        .catch(error => reject(error));
    });
}
*/