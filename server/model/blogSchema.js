const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 200,
    },
    link: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    email: {  // Added email field
        type: String,
        required: true, // Make sure email is required
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
