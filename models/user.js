
const {secret} = require('../config/secret-key.js')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, secret);
    return token
}

userSchema.statics.lookup = function(email, password) {
    return this.findOne({email, password})
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user, schema)
}

module.exports = {
    User: User,
    validateUser: validateUser
}