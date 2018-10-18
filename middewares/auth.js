const jwt = require('jsonwebtoken')
const {secret} = require('../config/secret-key')

module.exports = function(req, res, next) { // check whether the header of requests has valid token
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('Access denied. No token provided')

    try {
        const decoded = jwt.verify(token, secret)
        req.user = decoded
        next()
    } catch (ex) {
        res.status(400).send('Invalid Token')
    }
}