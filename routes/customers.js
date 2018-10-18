const express = require('express')
const router = express.Router()
const {Customer, validateCustomer} = require('./../models/customer')
const validate = require('./../middewares/validate')
const auth = require('./../middewares/auth')
const admin = require('../middewares/admin')
const validateObjId = require('./../middewares/validateObjId')
const _ = require('lodash')

router.get('/', async (req, res) => {
    const customers = await Customer.find({})
    .populate('rentals', '-customer -movie.genre -movie.__v -movie.numberInStock -movie.dailyRentalRate')
    .select('name email phone isGold rentals')

    res.send(customers)
})

router.get('/:id', validateObjId, async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if(!customer) return res.status(400).send('No customer found for that given id')

    res.send(customer)
})

router.get('/:email', async (req, res) => {
    const customer = await Customer.find({ email: req.params.email })

    if(!customer) return res.status(400).send('No customer found')

    res.send(customer)
})

router.post('/', [auth, validate(validateCustomer)],async (req, res) => {

    const newCustomer = new Customer(_.pick(req.body,['name', 'email', 'phone', 'isGold']))

    const customerInDb = await Customer.findOne({email: newCustomer.email})
    if(customerInDb) return res.status(400).send('This email has been already registered')

    await newCustomer.save()
    res.send(newCustomer)
})

router.put('/:id', [auth, admin, validateObjId, validate(validateCustomer)], async (req, res) => {

    const customer = await Customer.findByIdAndUpdate(req.params.id , {
        $set : _.pick(req.body, ['name', 'email', 'phone', 'isGold'])
    }, {
        new: true
    })
    res.send(customer)
})

router.delete('/:id', [auth, admin, validateObjId], async (req, res) => {

    const customer = await Customer.findOneAndRemove({ _id : req.params.id })

    if(!customer) return res.status(400).send('No customer were found for that given id')

    res.send(customer)
})

module.exports = router