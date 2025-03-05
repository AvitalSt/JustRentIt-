const Dress = require('../models/dressModel');
require('dotenv').config();

const getAllDresses = async (req, res) => {
  try {
    const dresses = await Dress.find();
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const dressesWithFullImageUrl = dresses.map(dress => ({
      ...dress.toObject(),
      image: `/uploads/${dress.image}`
    }));
    res.json(dressesWithFullImageUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getDressById = async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) return res.status(404).json({ error: 'Dress not found' });
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const dressWithFullImageUrl = {
      ...dress.toObject(),
      image: `/uploads/${dress.image}`
    };
    res.json(dressWithFullImageUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addDress = async (req, res) => {
  try {
    const { name, size, location, buyPrice, rentPrice } = req.body;
    const image = req.file.filename;
    const API_URL = process.env.REACT_APP_API_URL; // קבל את ה-API_URL מהסביבה
    const newDress = new Dress({ name, size, location, buyPrice, rentPrice, image: `<span class="math-inline">\{API\_URL\}/uploads/</span>{image}` });
    await newDress.save();
    res.status(201).json(newDress);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

const deleteDress = async (req, res) => {
  try {
    const dress = await Dress.findByIdAndDelete(req.params.id);
    if (!dress) return res.status(404).json({ error: 'Dress not found' });
    const API_URL = process.env.REACT_APP_API_URL; // קבל את ה-API_URL מהסביבה
    const dressWithFullImageUrl = {
      ...dress.toObject(),
      image: `<span class="math-inline">\{API\_URL\}/uploads/</span>{dress.image}` // הוסף את ה-URL המלא
    };
    res.json(dressWithFullImageUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllDresses, getDressById, addDress, deleteDress };
