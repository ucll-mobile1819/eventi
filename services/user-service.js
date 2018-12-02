const User = require("../models/user");
const bcrypt = require("../auth/bcrypt");
const auth = require('../auth/auth');
const essentialisizer = require('../util/essentialisizer');

function createUser(firstname, lastname, birthday, username, password, passwordConf, essentializyResponse = true) {
    return new Promise((resolve, reject) =>{
        if (password !== passwordConf) {
            return reject(new Error("Passwords don't match."));
        }
        if (!birthday) {
            birthday = null;
        }
        if (!username || username.toString().length > 120 || username.toString().length === 0) {
            return reject(new Error('Your username can not be empty or longer than 120 characters.'));
        } else {
            username = username.toString().trim().toLowerCase();
            if (!(/^[a-zA-Z0-9]+$/.test(username))) {
                return reject(new Error('Your username may not contain spaces or special characters.'));
            } 
        }

        User.User.findById(username)
        .then(user => {
            if (user) return Promise.reject(new Error('This user already exists.')); // ALSO CHECK FOR TOO LONG NAME
        })
        .then(() => bcrypt.secureString(password))
        .then((hash) => {
            return User.User.create({
                firstname,
                lastname,
                birthday,
                username:username.toLowerCase(),
                password: hash,
            });
        })
        .then(user => (essentializyResponse ? essentialisizer.essentializyUser(user) : user))
        .then(resolve)
        .catch(() => {
            reject(new Error("This user already exists."));
        })
    });
}

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        username = username.toLowerCase();
        let tmpUser;
        User.User.findOne({ where: { username } })
        .then(user => {
            if (!user) return reject(new Error('This user does not exist.'));
            tmpUser = user;
            return bcrypt.compareString(user.password, password);
        }).then(res => {
            if (!res) return reject(new Error('The password is incorrect.'));
            return essentialisizer.essentializyUser(tmpUser);
        })
        .then(user => {
            resolve({
                success: true,
                user,
                token: `JWT ${auth.createToken(tmpUser)}`
            });
        })
        .catch(reject);
    });
}

function getUser(currentUser, username) {
    if (currentUser.username === username) {
        return essentialisizer.essentializyUser(currentUser);
    }
    return new Promise((resolve, reject) => {
        let tmpUser;
        User.User.findByPrimary(username)
        .then(user => {
            if (!user) return Promise.reject(new Error('That user does not exist.'));
            tmpUser = user;
            return Promise.all([ currentUser.getGroups(), user.getGroups() ]); // Waits for both promises to succeed and returns both return values in an array [1, 2]
        })
        .then(results => {
            let result = results[0].concat(results[1]).map(el => el.id); // Concat joins the two arrays together
            // .map transforms every element { id: x, name: y, ... } to x

            if (result.length !== new Set(result).size) { // Transforming an array to a set removes all doubles, meaning they're in a joined group if the sizes are not the same
                return essentialisizer.essentializyUser(tmpUser);
            } else {
                return Promise.reject(new Error('You\'re not allowed to get info about that user.'));
            }
        })
        .then(resolve)
        .catch(reject); // == `.catch(error => reject(error));` == `.catch(error => { reject(error); });`
    });
}

function updateUser(currentUser, firstname, lastname, birthday, password) {
    return new Promise((resolve, reject) => {
        bcrypt.secureString(password)
        .then(passwd => {
            if (!!firstname) currentUser.firstname = firstname;
            if (!!lastname) currentUser.lastname = lastname;
            if (!!birthday) currentUser.birthday = birthday;
            if (!!password) currentUser.password = passwd;
            return currentUser.save();
        })
        .then(() => resolve())
        .catch(reject);
    });
}

module.exports = { createUser, loginUser, getUser, updateUser };
