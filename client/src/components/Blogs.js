import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Logo.png";
import "./Blogs.css";

function Blogs() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [userInitials, setUserInitials] = useState("");
    const [visibleItems, setVisibleItems] = useState([0, 1, 2, 3, 4, 5]);
    const [activeItem, setActiveItem] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogLink, setBlogLink] = useState("");
    const [blogType, setBlogType] = useState("");
    const [charCount, setCharCount] = useState(200);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories"); // Default to "All Categories"
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const sliderItems = [
        { icon: "fa-list", label: "All Categories" },
        { icon: "fa-pencil-alt", label: "Writing Tips" },
        { icon: "fa-camera", label: "Photography" },
        { icon: "fa-gamepad", label: "Gaming" },
        { icon: "fa-utensils", label: "Food & Recipes" },
        { icon: "fa-bicycle", label: "Fitness" },
        { icon: "fa-heart", label: "Lifestyle" },
        { icon: "fa-microphone", label: "Podcasting" },
        { icon: "fa-tv", label: "Entertainment" },
        { icon: "fa-cogs", label: "Technology" },
        { icon: "fa-briefcase", label: "Business" },
        { icon: "fa-newspaper", label: "News" },
        { icon: "fa-palette", label: "Art" },
        { icon: "fa-book", label: "Books" },
        { icon: "fa-music", label: "Music" },
        { icon: "fa-plane", label: "Travel" },
        { icon: "fa-users", label: "Social Media" },
        { icon: "fa-leaf", label: "Environment" },
    ];

    // Fetch blogs on component mount
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:3001/user/getblogs");
                setBlogs(response.data);
                setFilteredBlogs(response.data); // Initially, show all blogs
                console.log("Fetched blogs:", response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    // Set the initials of the user
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

    // Close menu if clicked outside
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

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        navigate("/");
    };

    const togglePopup = () => {
        setIsPopupVisible((prev) => !prev);
    };

    const goToNext = () => {
        if (visibleItems[5] < sliderItems.length - 1) {
            setVisibleItems(visibleItems.map(i => i + 6));
        }
    };

    const goToPrev = () => {
        if (visibleItems[0] > 0) {
            setVisibleItems(visibleItems.map(i => i - 6));
        }
    };

    const handleItemClick = (index) => {
        setActiveItem(index);
        const selected = sliderItems[index];
        setSelectedCategory(selected.label); // Set the selected category
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
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:3001/user/createblog", {
                title: blogTitle,
                content: blogContent,
                link: blogLink,
                type: blogType,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            togglePopup();
        } catch (error) {
            console.error("Error submitting blog:", error);
        }
    };

    // Filter blogs based on selected category
    useEffect(() => {
        if (selectedCategory && selectedCategory !== "All Categories") {
            // Filter blogs by the selected category type
            const filtered = blogs.filter(blog => blog.type === selectedCategory);
            setFilteredBlogs(filtered);
        } else {
            setFilteredBlogs(blogs); // Show all blogs if "All Categories" is selected
        }
    }, [selectedCategory, blogs]);

    return (
        <div>
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
            <div className="navbar-container">
                <button className="add-blogs" onClick={togglePopup}>
                    Create Blog<i className="fa-solid fa-plus" />
                </button>
                <div className="categories-container">
                    <button className="slider-arrow prev" onClick={goToPrev}>
                        <i className="fa-solid fa-arrow-left" />
                    </button>
                    <div className="categories-list">
                        {sliderItems.slice(visibleItems[0], visibleItems[5] + 1).map((item, index) => (
                            <div
                                key={index}
                                className={`category-item ${activeItem === visibleItems[0] + index ? "active" : ""}`}
                                onClick={() => handleItemClick(visibleItems[0] + index)}
                            >
                                <i className={`fa-solid ${item.icon}`} />
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                    <button className="slider-arrow next" onClick={goToNext}>
                        <i className="fa-solid fa-arrow-right" />
                    </button>
                </div>
            </div>
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
                                <p className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                <a href={blog.link} target="_blank" rel="noopener noreferrer">Read More</a>
                            </div>
                        ))
                    ) : (
                        <p>No blogs available for this category</p>
                    )}
                </div>
            </div>

            {isPopupVisible && (
                <div className="popup-overlay">
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
                        <select value={blogType} onChange={handleTypeChange}>
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
        </div>
    );
}

export default Blogs;
