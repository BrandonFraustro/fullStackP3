require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Phonebook = require('./models/phonebook')

const app = express() 
app.use(express.json())
app.use(cors())

const morganTokens = morgan(function (tokens, req, res){
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
    ].join(' ')
})
app.use(morganTokens);

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(phone => {
        response.json(phone)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id)
    .then(phonebook => {
        if(phonebook) {
            response.json(phonebook)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const phonebook = {
        name: body.name,
        number: body.number,
    }

    Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true })
        .then(updatedPhonebook => {
            response.json(updatedPhonebook)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Phonebook({
        name: body.name,
        number: body.number,
    })
    console.log(person);
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })   
})

const errorMorgan = morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})
app.use(errorMorgan)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})