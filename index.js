const express = require('express');
const app = express();

const persons = [
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
        id: 4
    },
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (req, res) => {
    res.send(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.send(person);
    } else {
        res.sendStatus(404);
    }
    
})

app.get('/info', (req, res) => {
    const length = persons.length;
    const date = new Date();
    res.send(`<p>puhelinluettelossa ${length} hengen tiedot</p>${date}`)
})

app.listen(3001, () => {
    console.log('Server started on port 3001')
})