const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config();
const connectDB = require('./connection'); 
const userRoute = require('./route/userroute');

const app = express();

// Middleware
app.use(cors({ origin: "https://bloghouse-site.onrender.com" })); // Replace with your frontend URL
app.use(express.json());
app.use(compression());

// Routes
app.use('/user', userRoute);

// Serve static files from the React app's build directory
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Catch-all route for React client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
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
