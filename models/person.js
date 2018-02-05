require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  updatedAt: Date
});

module.exports = Person;