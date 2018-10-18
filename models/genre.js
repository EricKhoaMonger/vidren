const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    movies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
})

const Genre = mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(genre, schema)
}

module.exports = {
    genreSchema: genreSchema,
    Genre: Genre,
    validateGenre: validateGenre
}