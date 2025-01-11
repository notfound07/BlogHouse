const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config();
const connectDB = require('./connection'); 
const userRoute = require('./route/userroute');

const app = express();

// Middleware
app.use(cors({ origin: "https://bloghouse-site.onrender.com" })); // Replace with your frontend's Render URL
app.use(express.json());
app.use(compression());

// API Routes
app.use('/user', userRoute);

// Serve Static Files
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Catch-All Route for React (Handle Client-Side Routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
    try {
        await connectDB(); // Connect to the database
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
});
