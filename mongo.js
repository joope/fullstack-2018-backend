if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config();
}
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  updatedAt: Date
});

const [name, number] = process.argv.slice(2,4);

if (name && number) {
  const newPerson = new Person({
    name,
    number,
    updatedAt: new Date()
  });
  newPerson
    .save()
    .then(() => {
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