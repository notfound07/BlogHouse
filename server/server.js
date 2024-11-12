const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDB = require('./connection'); 
const userRoute = require('./route/userroute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
});
