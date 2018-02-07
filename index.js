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
        .then(persons => {
            res.json(persons.map(Person.format))
        })
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
    const { name, number } = req.body;

    if (name && number) {
        const newPerson = new Person({
            name,
            number,
            updatedAt: new Date()
        });
        newPerson
            .save()
            .then(person => {
                res.json(Person.format(person))
            })
            .catch(err => {
                console.log(err)
                res.sendStatus(500)
            });
    } else {
        res.status(400).json({error: 'Missing required fields!'})
    }
});

app.delete('/api/persons/:id', (req, res) => {
    Person
        .remove({_id: req.params.id})
        .then(res.sendStatus(204))
        .catch(err => res.sendStatus(500))
})

app.put('/api/persons/:id', (req, res) => {
    const { id, name, number } = req.body;
    const person = {
        name,
        number,
    }
    Person
        .findByIdAndUpdate(req.params.id, person, { new: true})
        .then(updated => {
            res.json(Person.format(updated))
        }).catch(err => {
            console.log(err);
            res.status(400).send({error: 'no such person'})
        })
})

app.get('/info', (req, res) => {
    const length = persons.length;
    const date = new Date();
    res.send(`<p>puhelinluettelossa ${length} hengen tiedot</p>${date}`)
})


app.listen(PORT, () => {
    console.log('Server started on port', PORT)
})