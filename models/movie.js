const mongoose = require('mongoose')
const Joi = require('joi')
const {genreSchema} = require('../models/genre')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    genre: {
        type: genreSchema,
        required:true
    },
    numberInStock: {
        type: Number, 
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number, 
        required: true,
        min: 0,
        max: 255
    }
})

movieSchema.statics.create = function(title, genreId, genreName, numberInStock, dailyRentalRate) {
    return new Movie({
        title,
        genre:{
            _id: genreId,
            name: genreName
        },
        numberInStock,
        dailyRentalRate
    })
}

movieSchema.statics.format = function(movie) {
    return {
        _id: movie._id,
        title: movie.title,
        genre:{
            _id: movie.genre._id,
            name: movie.genre.name
        },
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate
        }
}


const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }
    return Joi.validate(movie, schema)
}

module.exports = {
    movieSchema: movieSchema,
    Movie: Movie,
    validateMovie: validateMovie
}