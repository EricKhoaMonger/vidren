const express = require('express')
const router = express.Router()
const Joi = require('joi')
const validate = require('../middewares/validate')
const {User} = require('../models/user')

router.post('/',validate(validateAuth) , async (req, res) => { // login route
    const user = await User.lookup(req.body.email, req.body.password)
    if(!user) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    res.send(token) // send token back to client for future requests
})

function validateAuth(req) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
    return Joi.validate(req, schema)
}

module.exports = router