require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const dressRoutes = require('./routes/dressRoutes');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', dressRoutes);
app.use('/', emailRoutes);
app.use('/', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
