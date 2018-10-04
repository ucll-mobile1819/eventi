function loggedIn(req, res, next) {
    // Example:
    /*
        if (magicalLoginCheckFunction()) {
            return next(); // continue the middleware flow
        } else {
            return res.status(401).send(); // break the middleware flow
        }
    */
}

module.exports = { loggedIn };