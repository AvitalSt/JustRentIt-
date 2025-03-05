const Dress = require('../models/dressModel');

const getAllDresses = async (req, res) => {
    try {
        const dresses = await Dress.find();
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
        res.json(dress);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const addDress = async (req, res) => {
    try {
        const { name, size, location, buyPrice, rentPrice } = req.body;
        const image = req.file.filename;
        const newDress = new Dress({ name, size, location, buyPrice, rentPrice, image: image });
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
        res.json(dress);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllDresses, getDressById, addDress, deleteDress };