const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3001
let people = [
  {
    "name": "John doe",
    "number": "1234567890",
    "id": 1
  },
  {
    "name": "Jane doe",
    "number": "9876543210",
    "id": 2
  },
  {
    "name": "Gaurav Thakur",
    "number": "1234512345",
    "id": 3
  }
]

const generateId = () => Math.floor(Math.random()* 10000) + 1

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }

// app.use(requestLogger)

morgan.token('reqData', function(req, res){
  if(Object.keys(req.body).length)
  {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData',{immediate: "immediate"}))

app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${people.length} people <br> ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    if(person)
    {
        res.send(person)
    }
    else
    {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if(!person.name)
    {
        return res.status(400).json({error: "Name is missing"})
    }
    if(!person.number)
    {
        return res.status(400).json({error: "Number is missing"})
    }
    const isNameExists = people.find(p => p.name.toLowerCase() === person.name.toLowerCase())
    if(isNameExists)
    {
        return res.status(400).json({error: "Name must be unique"})
    }
    person.id = generateId()
    people = people.concat(person)
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))