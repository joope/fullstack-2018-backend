require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  updatedAt: Date
});

personSchema.statics.format = function(person) {
  const { _id, name, number, updatedAt } = person;
  return {
    id: _id,
    name,
    number,
    updatedAt
  };
}

const Person = mongoose.model('Person', personSchema);

module.exports = Person;