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

if (!DB_URI) {
    console.error("❌ No DB_URI found in environment variables!");
    process.exit(1);
}

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/', dressRoutes);
app.use('/', emailRoutes);
app.use('/', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;   
