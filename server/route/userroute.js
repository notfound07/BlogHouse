const express = require('express');
const { registerUser, loginUser, createBlog, getBlogs, verifyToken } = require('../controllers/usercontroller');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/createblog', verifyToken, createBlog);
router.get('/getblogs', getBlogs);

module.exports = router;
