const passport = require('passport');
const jwt = require('../auth/auth');

const loggedIn = passport.authenticate('jwt', { session: false });

module.exports = { loggedIn };