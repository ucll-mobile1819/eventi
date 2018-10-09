const User = require("../models/user");

function createUser(firstname, lastname, birthday, username, password, passwordConf) {
    // TODO: CHECK PASSWD

    return new Promise((resolve, reject) =>{
        User.User.create({
            firstname,
            lastname,
            birthday,
            username,
            password,
        }).then((res) => {
            resolve();
        }).catch(() => {
            reject(new Error("This user already exists."));
        })
    });
}

module.exports = {createUser};