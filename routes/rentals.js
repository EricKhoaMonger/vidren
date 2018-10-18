const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {Rental, validateRental} = require('./../models/rental')
const {Movie} = require('./../models/movie')
const {Customer} = require('./../models/customer')
const validate = require('./../middewares/validate')
const auth = require('./../middewares/auth')
const admin = require('../middewares/admin')
const validateObjId = require('./../middewares/validateObjId')
const _ = require('lodash')
const Fawn = require('fawn')


router.get('/', async (req, res) => {
    let rentals = await Rental.find({}).sort('dateOut')

    // rentals = rentals.map(rental => Rental.format(rental))

    res.send(rentals)
})

router.get('/:id', validateObjId, async (req, res) => {
    const rental = await Rental.findById(req.params.id).sort('-dateOut')
    if(!rental) return res.status(404).send('No rental were found for this given Id')

    res.send(rental)
})

router.post('/', [auth, validate(validateRental)],async (req, res) => {
    const customer = await Customer.findById(req.body.customerId)
    if(!customer) res.status(404).send('No customer were found for this given customerId')

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) res.status(404).send('No movie were found for this given movieId')
    
    if(movie.numberInStock === 0) return res.status(400).send('This movie is currently not in stock')

    const rentalInDB = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    })
    if(rentalInDB && !rentalInDB.dateReturn) return res.status(400).send('Already in database')
    
    const rental = new Rental({
        customer,
        movie
    })

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .update('customers', { _id: customer._id }, {
                $push: {
                    rentals: rental._id
                }
            })
            .run()
        
            res.send(rental)
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }

})

// router.put('/:id', [auth, admin, validateObjId, validate(validateCustomer)], async (req, res) => {

// })

// router.delete('/:id', [auth, admin, validateObjId], async (req, res) => {

// })

module.exports = router