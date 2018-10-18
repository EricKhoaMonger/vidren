const express = require('express')
const router = express.Router()
const {Genre, validateGenre} = require('./../models/genre')
const validate = require('./../middewares/validate')
const auth = require('./../middewares/auth')
const admin = require('../middewares/admin')
const validateObjId = require('./../middewares/validateObjId')

router.get('/', async (req, res) => {
    const genres = await Genre.find({}).populate('movies')

    res.send(genres)
})
router.get('/:id', validateObjId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)

    if(!genre) return res.status(400).send('No genre found for that given id')

    res.send(genre)
})
router.post('/', validate(validateGenre),async (req, res) => {

    const genreInDb = await Genre.findOne({name: req.body.name})
    if (genreInDb) return res.status(400).send('Already have that genre name')

    const newGenre = new Genre({
        name: req.body.name
    })

    await newGenre.save()
    res.send(newGenre)
})
router.put('/:id', [auth, admin, validateObjId, validate(validateGenre)], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id , {name: req.body.name}, {
        new: true
    })
    res.send(genre)
})
router.delete('/:id', [auth, admin, validateObjId], async (req, res) => {

    if(!req.params.id) return res.status(400).send('Id is not provided')

    const genre = await Genre.findOneAndRemove({ _id : req.params.id })

    if(!genre) return res.status(400).send('No genre found for that given id')

    res.send(genre)
})

module.exports = router