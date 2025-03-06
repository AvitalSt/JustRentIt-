const mongoose = require('mongoose');

const dressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  location: { type: String, required: true },
  buyPrice: { type: Number, required: true },
  rentPrice: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String, required: true},
});

const Dress = mongoose.model('Dress', dressSchema);
module.exports = Dress;
