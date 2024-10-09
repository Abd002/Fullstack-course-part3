const express = require('express')
var morgan = require('morgan')



const app = express()

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body));


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors')
app.use(cors())

data =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const infoDisplay=()=>{
    return `<h3>Phonebook has info for ${data.length}</h3>\
    <h3>${Date()}</h3>`
}


app.get('/', (request, response)=>{
    response.send('<h1>Hello, world</h1>')
})
app.get('/api/persons', (request, response)=>{
    response.json(data)
})
app.get('/info', (request, response)=>{
    response.send(infoDisplay())
})
app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = data.find(person=> person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)
    console.log(data)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    const check = data.find(person=>person.name === body.name)

    if(check){
        return response.status(400).json({ error: 'name must be unique' })
    }
  
    const person = {
        name: body.name,
        number: body.number,
        id : String(Math.floor(Math.random() * 1e6))
    }
  
    data = data.concat(person)
    console.log(data)
    response.json(data)
    
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint); // Should be added after all other routes

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})