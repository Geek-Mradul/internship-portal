// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // <-- IMPORT YOUR ROUTES

const app = express();
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
    res.send('Internship Portal API is running!');
});

// Use Auth Routes -->
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));