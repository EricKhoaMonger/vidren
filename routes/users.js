const express = require('express')
const router = express.Router()
const {User, validateUser} = require('./../models/user')
const validate = require('../middewares/validate')
const _ = require('lodash')
const auth = require('./../middewares/auth')

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id)

    res.send(_.pick(user, ['name', 'email', 'isAdmin']))
})

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({email: req.body.email})
    if(user) res.status(400).send('This email is already registered')

    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    await user.save()

    const token = user.generateAuthToken()

    res.header('x-auth-token', token).send(_.pick(user,['_id', 'name', 'email']))
})

router.put('/:id', [auth, validate(validateUser)], async (req, res) => {
    let user = await User.findByIdAndUpdate(req.params.id, {
        $set : _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
    }, {
        new: true
    })
    if(!user) return res.status(400).send('No user found')

    await user.save()

    res.send(_.pick(user,['_id', 'name', 'email', 'isAdmin']))
})

router.delete('/:id', auth, async (req, res) => {
    let user = await User.findByIdAndRemove(req.params.id)
    if(!user) return res.status(400).send('No user found')

    res.send(user)
})

module.exports = router