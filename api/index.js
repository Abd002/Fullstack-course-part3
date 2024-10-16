const express = require('express')
var morgan = require('morgan')
require("dotenv").config()

const Persone = require('../models/persone')


const app = express()
app.use(express.static('dist')) // IMPORTANT: This uses middleware to show static content (HTML & JS in dist)
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors')
app.use(cors())

const infoDisplay=()=>{
    return `<h3>Phonebook has info for ${data.length}</h3>\
    <h3>${Date()}</h3>`
}


app.get('/', (request, response, next)=>{
    response.send('<h1>Hello, world</h1>')
})
app.get('/api/persons', (request, response)=>{
  Persone.find({}).then(result => {
    response.json(result)
  })
  .catch(error => next(error))
})
app.get('/info', (request, response, next)=>{
    response.send(infoDisplay())
})
app.get('/api/persons/:id', (request, response, next)=>{
    const id = request.params.id
    Persone.findById(id).then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Persone.findByIdAndDelete(id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const new_person = new Persone({
    name: body.name,
    number: body.number,
  })

  Persone.findOne({ name: body.name }).then(result => {
    console.log(result)
    if(result){
      return response.status(400).json({ error: 'name must be unique' })
    }else{
      new_person.save().then(savedNote => {
        response.json(savedNote)
      }).catch(error => next(error))
    }
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id',(request, response, next)=>{
  const id = request.params.id
  const body = request.body

  const persone = {
    name: body.name,
    number: body.number ,
  }

  console.log(persone, id)

  Persone.findByIdAndUpdate(id, persone, { new: true })
    .then(updatedPersone => {
      console.log(updatedPersone)
      response.json(updatedPersone)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint); // Should be added after all other routes


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
