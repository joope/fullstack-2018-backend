const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

const PORT = process.env.PORT || 3001;

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
})

app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Jaakko Juupaseipäs",
        number: "040-123456",
        id: 2
    },
    {
        name: "Helppo Heikkii",
        number: "040-123456",
        id: 3
    },
    {
        name: "Olli Oppiva",
        number: "040-123456",
        id: 5
    },
]

const findPerson = (id) => persons.find(p => p.id === id);

const personIsValid = (person={}) => {
    if (person.name && person.number) {
        if (persons.find(p => p.name === person.name)){
            return { message: 'name must be unique', status: 403 }
        }
        return { message: null, status: 200 }
    }
    return { message: 'some required fields are missing', status: 400 }
}

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(result => res.json(result))
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = findPerson(id);

    if (person) {
        res.send(person);
    } else {
        res.sendStatus(404);
    }
})

app.post('/api/persons/', (req, res) => {
    const person = req.body;
    const err = personIsValid(person)
    if (err.message) {
        return res.status(err.status).json({error: err.message});
    }

    person.id = Math.floor(Math.random()*1000000000);

    persons = persons.concat(person);

    
    res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id)
    
    res.sendStatus(204);
})

app.get('/info', (req, res) => {
    const length = persons.length;
    const date = new Date();
    res.send(`<p>puhelinluettelossa ${length} hengen tiedot</p>${date}`)
})


app.listen(PORT, () => {
    console.log('Server started on port', PORT)
})