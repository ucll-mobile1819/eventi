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

        bcrypt.secureString(password)
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
    return new Promise((resolve, reject) => {
        if (currentUser.username === username) return resolve(currentUser);
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

module.exports = { createUser, loginUser, getUser };
