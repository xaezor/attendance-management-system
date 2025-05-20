// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config(); // Ensure .env variables are loaded

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ extended: false })); // Allows us to accept JSON data in req.body

// Define Routes
app.get('/', (req, res) => res.send('Attendance API Running')); // Simple test route
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
