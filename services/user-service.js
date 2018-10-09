const User = require("../models/user");
const bcrypt = require("../auth/bcrypt");
const auth = require('../auth/auth');

function createUser(firstname, lastname, birthday, username, password, passwordConf) {
    return new Promise((resolve, reject) =>{
        if (password !== passwordConf) {
            return reject(new Error("Passwords don't match."));
        }

        bcrypt.secureString(password)
        .then((hash) => {
            User.User.create({
                firstname,
                lastname,
                birthday,
                username,
                password: hash,
            })
        }).then((res) => {
            resolve();
        }).catch(() => {
            reject(new Error("This user already exists."));
        })
    });
}

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        let tmpUser;
        User.User.findOne({ where: { username } })
        .then(user => {
            if (!user) return reject(new Error('This user does not exist.'));
            tmpUser = user;
            return bcrypt.compareString(user.password, password);
        }).then(res => {
            if (!res) return reject(new Error('The password is incorrect.'));
            resolve({
                success: true,
                user: { username: tmpUser.username, firstname: tmpUser.firstname, lastname: tmpUser.lastname, birthday: tmpUser.birthday },
                token: `JWT ${auth.createToken(tmpUser)}`
            });
        })
    });
}

module.exports = { createUser, loginUser };
