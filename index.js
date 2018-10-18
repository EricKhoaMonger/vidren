const path = require('path')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const genres = require('./routes/genres')
const users = require('./routes/users')
const auth = require('./routes/auth')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const returns = require('./routes/returns')
const mongoose = require('mongoose')
const db = require('./config/db-dev')
const Fawn = require('fawn')

Fawn.init(mongoose);

const options = {useNewUrlParser: true}

mongoose.connect(db.dbURI, options)
    .then(() =>  console.log('MongoDB Connected'))
    .catch(err => console.log(`Error: ${err}`))

const app = express()

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, x-auth-token, Access-Control-Allow-Headers, Accept, Authorization");
    next();
});

app.use('/api/genres', genres)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/movies', movies)
app.use('/api/customers', customers)
app.use('/api/rentals', rentals)
app.use('/api/returns', returns)

// handle production
if(process.env.NODE_ENV == 'production') {
    // set Static folder
    app.use(express.static(__dirname + '/public'))

    // handle SPA
    app.get(/.*/, (req, rest) => res.sendFile(__dirname + '/public/index.html'))
}

const port = process.env.PORT || 5000

const server = app.listen(port, () => console.log(`Listening to port ${port}`))