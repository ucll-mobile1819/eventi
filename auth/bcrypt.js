const bcrypt = require("bcrypt-nodejs");
const saltRounds = 10;

function secureString(string) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(string, salt, null, function(err, hash) {
                resolve(hash);
            });
        });
    });    
}

function compareString(hash, string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hash, function(err, res) {
            resolve(res);
        });
    });
}

module.exports = {secureString, compareString};