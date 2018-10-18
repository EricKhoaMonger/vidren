const Joi = require('joi')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    rentals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental'
    }]
})

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema)
}

module.exports = {
    customerSchema: customerSchema,
    Customer: Customer,
    validateCustomer: validateCustomer
}