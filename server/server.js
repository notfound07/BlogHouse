const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const connectDB = require('./connection'); 
const userRoute = require('./route/userroute');

const app = express();

// Middleware
app.use(cors({ origin: "https://bloghouse-site.onrender.com" })); // Replace with your frontend URL
app.use(express.json());
app.use(compression());
app.use(morgan("tiny")); // Logs incoming requests for debugging

// Routes
app.use('/user', userRoute);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all route for handling client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
    try {
        await connectDB(); // Ensure DB connection pooling
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
});
