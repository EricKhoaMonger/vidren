const mongoose = require('mongoose')
const Joi = require('joi')
const {customerSchema} =require('../models/customer')
const {movieSchema} =require('../models/movie')
const moment = require('moment')

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required:true,
        default: Date.now()
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.format = function (rental) {
    return {
        dateOut: rental.dateOut,
        _id: rental._id,
        customer: {
            isGold: rental.customer.isGold,
            _id: rental.customer._id,
            name: rental.customer.name,
            phone: rental.customer.phone
        },
        movie: {
            _id: rental.movie._id,
            title: rental.movie.title,
            dailyRentalRate: rental.movie.dailyRentalRate
        }
    }
}

rentalSchema.methods.return = function() {
    this.dateReturn = Date.now()
    
    const rentingDays = moment(this.dateReturn).diff(this.dateOut, 'days')
    this.rentalFee = this.customer.isGold ? rentingDays * this.movie.dailyRentalRate * 0.9 : rentingDays * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
    const schema = {
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema)
}

module.exports = {
    rentalSchema: rentalSchema,
    Rental: Rental,
    validateRental: validateRental
}