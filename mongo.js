require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  updatedAt: Date
});

const [a, b, name, number] = process.argv;

if (name && number) {
  const newPerson = new Person({
    name,
    number,
    updatedAt: new Date()
  });
  newPerson
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${name} numero ${number} luetteloon`);
      mongoose.connection.close();
    });
} else {
  Person
    .find({})
    .then(res => {
      console.log('puhelinluettelo:');
      res.forEach(p => console.log(p.name, p.number));
      mongoose.connection.close();
    });
}