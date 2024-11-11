const User = require('../model/userSchema');
const Blog = require('../model/blogSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token and extract user information
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Attach user info to request object
        next();  // Proceed to the next middleware or controller
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    try {
        if (!name || !email || !password || !confirmpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (!validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z_.@]{9,}$/)) {
            return res.status(400).json({ message: "Password must meet complexity requirements" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ message: "Login successful", token, name: user.name });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Create Blog
const createBlog = async (req, res) => {
    const { title, content, link, type } = req.body;

    try {
        if (!title || !content || !link || !type) {
            return res.status(400).json({ message: "Title, content, link, and type are required" });
        }

        // Extract the user's email from the JWT token
        const userEmail = req.user.email;  // req.user contains decoded user info

        const newBlog = new Blog({
            title,
            content,
            link,
            type,
            email: userEmail,  // Store user's email in the blog post
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: "Error creating blog" });
    }
};

// Get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        if (blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found" });
        }
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    createBlog,
    getBlogs,
    verifyToken,
};
