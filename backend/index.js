const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const url = `mongodb://fullstack:fullstack@ac-oczpbnc-shard-00-00.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-01.qzx21qr.mongodb.net:27017,ac-oczpbnc-shard-00-02.qzx21qr.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-8rgob8-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(url)

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

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Phonebook = mongoose.model('Phonebook', phonebookSchema)

const errorMorgan = morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(phone => {
        response.json(phone)
    })
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${date}</p>`)
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

const randomId = () => {
    const idR = Math.floor(Math.random() * (1000 - 100) + 100)
    const existId = persons.find(n => n.id === idR)
    return idR
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const existName = persons.find(n => n.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(existName !== undefined) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {
        const person = {
            id: randomId(),
            name: body.name,
            number: body.number,
        }   
        persons = persons.concat(person)
    }
    response.json(body)
})

app.use(errorMorgan)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})