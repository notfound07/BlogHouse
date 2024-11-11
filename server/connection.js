const mongoose = require('mongoose');

const URL = "mongodb+srv://amanbhatt199916:ahy4cynkUNaMa0Et@bloghousecluster.kzk9l.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting with the database', error); 
    }

};

module.exports = connectDB;