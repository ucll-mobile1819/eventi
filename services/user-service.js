const User = require("../models/user");
const bcrypt = require("../auth/bcrypt");

function createUser(firstname, lastname, birthday, username, password, passwordConf) {
    // TODO: CHECK PASSWD

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

module.exports = {createUser};