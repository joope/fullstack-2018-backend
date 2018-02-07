const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

const PORT = process.env.PORT || 3001;

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(Person.format));
    });
});

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => res.send(Person.format(person)))
    .catch(() => {
      // console.log(err);
      res.sendStatus(404);
    });
});

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
        res.json(Person.format(person));
      })
      .catch(() => {
        // console.log(err)
        res.status(400).send({error: 'Tried to multiply same person!'});
      });
  } else {
    res.status(400).json({error: 'Missing required fields!'});
  }
});

app.delete('/api/persons/:id', (req, res) => {
  Person
    .remove({_id: req.params.id})
    .then(res.sendStatus(204))
    .catch(() => res.sendStatus(500));
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;
  const person = {
    name,
    number,
    updatedAt: new Date()
  };
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true})
    .then(updated => {
      res.json(Person.format(updated));
    }).catch(() => {
      // console.log(err);
      res.status(400).send({error: 'no such person'});
    });
});

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const date = new Date();
      res.send(`<p>puhelinluettelossa ${persons.length} hengen tiedot</p>${date}`);
    }).catch(() => {
      res.sendStatus(500);
    });
});


app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});