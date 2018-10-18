const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token')
    const decoded  = jwt.decode(token)

    if(!decoded.isAdmin) return res.status(403).send('Unauthorized')

    next()
}