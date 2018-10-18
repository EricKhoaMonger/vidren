const express = require('express')
const router = express.Router()
const validate = require('../middewares/validate')
const auth = require('./../middewares/auth')
const validateObjId = require('./../middewares/validateObjId')
const admin = require('./../middewares/admin')
const {Movie, validateMovie} = require('./../models/movie')
const {Genre} = require('./../models/genre')
const _ = require('lodash')
const Fawn = require('fawn')

router.get('/', async (req, res) => {
    const movies = await Movie.find({})

    res.send(movies.map(movie => Movie.format(movie)))
})

router.get('/:id', validateObjId, async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if(!movie) return res.status(404).send('No movie were found for the given Id')

    res.send(Movie.format(movie))
})

router.post('/', [auth, validate(validateMovie)], async (req, res) => {
    // const movie = await new Movie(_.pick(req.body, ['title', 'genreId', 'numberInStock', 'dailyRentalRate']))

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('No genre were found for the given genreId')

    const movie  = await Movie.create(
        req.body.title,
        req.body.genreId,
        genre.name,
        req.body.numberInStock,
        req.body.dailyRentalRate
    )

    const movieInDb = await Movie.findOne({ title: req.body.title})
    if(movieInDb) return res.status(400).send('Movie title already exists')

    try {
        Fawn.Task()
        .save('movies', movie)
        .update('genres', { _id: genre._id }, {
            $push: { movies: movie._id }
        })
        .run()

        res.send(Movie.format(movie))
    } catch (error) {
        console.log(error);
        
        res.status(500).send('Something went wrong')
    }
})

router.put('/:id', [auth, admin, validate(validateMovie)], async (req, res) => {

    const movie = await Movie.findByIdAndUpdate(req.params.id , {
        $set : _.pick(req.body, ['title', 'genreId', 'numberInStock', 'dailyRentalRate'])
    }, {
        new: true
    })

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send('No genre were found for the given genreId')

    await movie.save()

    res.send(Movie.format(movie))
})

router.delete('/:id', [auth, admin, validateObjId], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if(!movie) return res.status(404).send('No movie were found for the given genreId')

    res.send(Movie.format(movie))
})

module.exports = router