if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config();
}
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
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