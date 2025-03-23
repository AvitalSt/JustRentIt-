const Dress = require('../models/dressModel');

const getAllDresses = async (req, res) => {
    try {
        const colorFilter = req.query.color;
        const locationFilter = req.query.location;
        const sortBy = req.query.sortBy;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 16;
        const filter = {};

        if (colorFilter) {
            filter.color = { $regex: colorFilter, $options: 'i' };
        }
        if (locationFilter) {
            filter.location = { $regex: locationFilter, $options: 'i' };
        }

        let sortOptions = { _id: 1 };

        if (sortBy === 'price-asc') {
            sortOptions = { rentPrice: 1 };
        } else if (sortBy === 'price-desc') {
            sortOptions = { rentPrice: -1 };
        }

        const skip = (page - 1) * limit;

        const colorCounts = await Dress.aggregate([
            {
                $project: {
                    colors: { $split: ["$color", " "] }
                }
            },
            {
                $unwind: "$colors"
            },
            {
                $group: {
                    _id: "$colors",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const locationCounts = await Dress.aggregate([
            {
                $project: {
                    locations: { $split: ["$location", " "] }
                }
            },
            {
                $unwind: "$locations"
            },
            {
                $group: {
                    _id: "$locations",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const dresses = await Dress.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalCount = await Dress.countDocuments(filter);

        const dressesWithFullImageUrl = dresses.map(dress => ({
            ...dress.toObject(),
            image: `${process.env.REACT_APP_API_URL}/uploads/${dress.image}`
        }));

        res.json({
            dresses: dressesWithFullImageUrl,
            colorCounts,
            locationCounts,
            totalCount
        });
    } catch (err) {
        console.error("Error in getAllDresses:", err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

const getDressById = async (req, res) => {
    try {
        const dress = await Dress.findById(req.params.id);
        if (!dress) return res.status(404).json({ error: 'Dress not found' });
        const dressWithFullImageUrl = {
            ...dress.toObject(),
            image: `${process.env.REACT_APP_API_URL}/uploads/${dress.image}` 
        };
        res.json(dressWithFullImageUrl);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const addDress = async (req, res) => {
    try {
        const { name, size, location, buyPrice, rentPrice, color } = req.body;
        const image = req.file.filename;
        const newDress = new Dress({ name, size, location, buyPrice, rentPrice, image, color });
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