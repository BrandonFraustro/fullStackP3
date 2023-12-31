const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express() 

app.use(express.json())

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
app.use(morganTokens)

const errorMorgan = morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-1234567"
      },
      {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
      },
      {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      },
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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