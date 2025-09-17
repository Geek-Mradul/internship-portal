// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');
const internshipRoutes = require('./routes/internshipRoutes');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
const applicationRoutes = require('./routes/applicationRoutes');
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
    res.send('Internship Portal API is running!');
});

// Use Auth Routes
app.use('/api/auth', authRoutes);


// --- ADD THIS PROTECTED ROUTE ---
// This route is for testing if a user's token is valid.
app.get('/api/me', auth, (req, res) => {
    // If the request reaches here, it means the 'auth' middleware
    // successfully verified the token. The user's info is in req.user.
    res.status(200).json({
        message: "Token is valid. User is authenticated.",
        user: req.user
    });
});
// ---------------------------------
app.use('/api/internships', internshipRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/apply', applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));