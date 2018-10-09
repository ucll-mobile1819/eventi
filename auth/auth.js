const passport = require('passport');
const passportJwt = require('passport-jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = '30d2afadca7b1ea5f0e82628340d8a491931708dc9f135ff58dd30eae487cbce';

const jwtOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: secret
};

const jwtStrategy = new passportJwt.Strategy(jwtOptions, async (payload, done) => {
    User.User.find({ where: {
        username: payload.id
    }})
    .then(user => {
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
});

passport.use(jwtStrategy);

function createToken(args) {
    return jwt.sign({ id: args.username }, secret);
}

module.exports = { createToken };