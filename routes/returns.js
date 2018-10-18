const Joi = require('joi')
const express = require('express')
const router = express.Router()
const validate = require('../middewares/validate')
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const {Rental} = require('../models/rental')
const auth = require('../middewares/auth')
const admin = require('../middewares/admin')
const Fawn = require('fawn')


router.post('/', [auth, admin, validate(validateReturn)], async (req, res) => {
    const customer = await Customer.findById(req.body.customerId)
    if(!customer) res.status(404).send('No customer were found for this given customerId')

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) res.status(404).send('No movie were found for this given movieId')

    const rentalArr = await Rental.find({
       'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    })
    const rental = await Rental.findById( req.body.rentalId )
    if(!rental) return res.status(404).send('No rental were found')

    if(rentalArr.length == 1 && rentalArr[0].dateReturn) return res.status(400).send('Already proccessed. Please make another rental.')
    

    rental.return()
    await rental.save()

    await Movie.updateOne({ _id: movie._id }, {
        $inc: { numberInStock: 1 }
    })

    await Customer.updateOne({ _id: req.body._id }, {
        $pull: { rentals: rental._id }
    })

    res.send(rental)
})

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        rentalId: Joi.objectId().required()
    }

    return Joi.validate(req, schema)
}

module.exports = router