import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Logo.png";
import Alert from './Alert';
import "./Blogs.css";

function Blogs() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [userInitials, setUserInitials] = useState("");
    const [visibleItemsCount, setVisibleItemsCount] = useState(6);
    const [activeItem, setActiveItem] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogLink, setBlogLink] = useState("");
    const [blogType, setBlogType] = useState("");
    const [charCount, setCharCount] = useState(200);
    const [blogs, setBlogs] = useState([]);
    const [alert, setAlert] = useState(null);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const baseURL =
        window.location.hostname === "localhost"
            ? "http://localhost:3001/user"
            : `${window.location.protocol}//bloghouse-server.onrender.com/user`;

    const sliderItems = [
        { icon: "fa-list", label: "All Categories" },
        { icon: "fa-pencil-alt", label: "Writing Tips" },
        { icon: "fa-newspaper", label: "News" },
        { icon: "fa-gamepad", label: "Gaming" },
        { icon: "fa-bicycle", label: "Fitness" },
        { icon: "fa-heart", label: "Lifestyle" },
        { icon: "fa-palette", label: "Art" },
        { icon: "fa-utensils", label: "Food & Recipes" },
        { icon: "fa-microphone", label: "Podcasting" },
        { icon: "fa-tv", label: "Entertainment" },
        { icon: "fa-plane", label: "Travel" },
        { icon: "fa-cogs", label: "Technology" },
        { icon: "fa-briefcase", label: "Business" },
        { icon: "fa-book", label: "Books" },
        { icon: "fa-camera", label: "Photography" },
        { icon: "fa-music", label: "Music" },
        { icon: "fa-users", label: "Social Media" },
        { icon: "fa-leaf", label: "Environment" },
    ];

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            const fetchBlogs = async () => {
                try {
                    const response = await axios.get(`${baseURL}/getblogs`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setBlogs(response.data);
                    setFilteredBlogs(response.data);
                    console.log("Fetched blogs:", response.data);
                } catch (error) {
                    console.error("Error fetching blogs:", error);
                }
            };
            fetchBlogs();
        }
    }, [navigate, baseURL]);

    useEffect(() => {
        const userName = localStorage.getItem("userName");
        if (userName) {
            const initials = userName
                .trim()
                .split(/\s+/)
                .map(name => name[0].toUpperCase())
                .join("");
            setUserInitials(initials);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const updateVisibleItemsCount = () => {
            const width = window.innerWidth;
            if (width >= 786) {
                setVisibleItemsCount(6);
            } else if (width >= 712) {
                setVisibleItemsCount(5);
            } else if (width >= 630) {
                setVisibleItemsCount(4);
            } else if (width >= 450) {
                setVisibleItemsCount(3);
            } else {
                setVisibleItemsCount(2);
            }
        };

        updateVisibleItemsCount();
        window.addEventListener("resize", updateVisibleItemsCount);

        return () => {
            window.removeEventListener("resize", updateVisibleItemsCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        navigate("/");
    };

    const togglePopup = () => {
        setIsPopupVisible((prev) => !prev);
    };

    const goToNext = () => {
        if (activeItem + visibleItemsCount < sliderItems.length) {
            setActiveItem(activeItem + visibleItemsCount);
        }
    };

    const goToPrev = () => {
        if (activeItem - visibleItemsCount >= 0) {
            setActiveItem(activeItem - visibleItemsCount);
        }
    };

    const handleItemClick = (index) => {
        setSelectedCategory(sliderItems[index].label);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleContentChange = (e) => {
        const content = e.target.value;
        setBlogContent(content);
        setCharCount(200 - content.length);
    };

    const handleTitleChange = (e) => {
        setBlogTitle(e.target.value);
    };

    const handleLinkChange = (e) => {
        setBlogLink(e.target.value);
    };

    const handleTypeChange = (e) => {
        setBlogType(e.target.value);
    };

    const handleBlogSubmit = async () => {
        if (!blogTitle || !blogContent) {
            showAlert("Title and content are required.", "error");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${baseURL}/createblog`, {
                title: blogTitle,
                content: blogContent,
                link: blogLink,
                type: blogType,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const newBlog = response.data;
            setBlogs((prevBlogs) => [...prevBlogs, newBlog]);

            if (selectedCategory === "All Categories" || selectedCategory === newBlog.type) {
                setFilteredBlogs((prevFilteredBlogs) => [...prevFilteredBlogs, newBlog]);
            }
            togglePopup();
            showAlert("Blog submitted successfully!", "success");
            setBlogTitle("");
            setBlogContent("");
            setBlogLink("");
            setBlogType("");
        } catch (error) {
            console.error("Error submitting blog:", error);
            showAlert("An error occurred while submitting the blog.", "error");
        }
    };


    useEffect(() => {
        if (selectedCategory && selectedCategory !== "All Categories") {
            const filtered = blogs.filter(blog => blog.type === selectedCategory);
            setFilteredBlogs(filtered);
        } else {
            setFilteredBlogs(blogs);
        }
    }, [selectedCategory, blogs]);

    return (
        <div className="container">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
            <nav className="navbar">
                <img className="logo" src={logo} alt="logo" />
                <div className="user-section">
                    <button className="menu-button" onClick={toggleMenu}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    {isMenuOpen && (
                        <div ref={menuRef} className="dropdown-menu">
                            <p className="username">Welcome, {localStorage.getItem("userName")}</p>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                    {userInitials && (
                        <div className="user-initials">{userInitials}</div>
                    )}
                </div>
            </nav>
            {isMenuOpen && <div className="overlay"></div>}
            <div className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
                <button className="add-blogs" onClick={togglePopup}>
                    Create Blog<i className="fa-solid fa-plus" />
                </button>
                <div className="categories-container">
                    <button className="slider-arrow prev" onClick={goToPrev}>
                        <i className="fa-solid fa-arrow-left" />
                    </button>
                    <div className="categories-list">
                        {sliderItems.slice(activeItem, activeItem + visibleItemsCount).map((item, index) => (
                            <div
                                key={activeItem + index}
                                className={`category-item ${selectedCategory === item.label ? "active" : ""}`}
                                onClick={() => handleItemClick(activeItem + index)}
                            >
                                <i className={`fa-solid ${item.icon}`} />
                                <p>{item.label}</p>
                                <span className="slider-dot"></span>
                            </div>
                        ))}
                    </div>
                    <button className="slider-arrow next" onClick={goToNext}>
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                </div>
            </div>

            {isPopupVisible && (
                <div className="popup-overlay">
                    {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
                    <div className="popup">
                        <h2>Add a New Blog</h2>
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={blogTitle}
                            onChange={handleTitleChange}
                        />
                        <textarea
                            placeholder="Blog Content"
                            maxLength="200"
                            value={blogContent}
                            onChange={handleContentChange}
                        />
                        <div className="char-count">{charCount} characters remaining</div>
                        <input
                            type="url"
                            placeholder="Blog Link Url"
                            value={blogLink}
                            onChange={handleLinkChange}
                        />
                        <select className="blog-type-select" value={blogType} onChange={handleTypeChange}>
                            <option value="">Select Blog Type</option>
                            {sliderItems.map((item, index) => (
                                <option key={index} value={item.label}>{item.label}</option>
                            ))}
                        </select>
                        <div className="popup-buttons">
                            <button className="submit-btn" onClick={handleBlogSubmit}>
                                Submit
                            </button>
                            <button className="close-btn" onClick={togglePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="blogs-container">
                <div className="blogs-list">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                            <div key={blog._id} className="blog-item">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-content">{blog.content.slice(0, 200)}</p>
                                <p className="blog-type">{blog.type}</p>
                                <div className="blog-email-container">
                                    <i className="fa-solid fa-user"></i>
                                    <p className="blog-email" >{blog.email}</p>
                                </div>
                                <div className="blog-date-container">
                                    <a href={blog.link} target="_blank" rel="noopener noreferrer">Read More</a>
                                    <p className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No blogs available for this category</p>
                    )}
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2024 BlogHouse. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#/">About</a> |
                    <a href="#/">Contact</a> |
                    <a href="#/">Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Blogs;
