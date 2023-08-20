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

const errorMorgan = morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(phone => {
        response.json(phone)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
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

app.use(errorMorgan)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})