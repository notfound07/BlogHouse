import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from './Alert';
import './Login.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001/user"
      : `${window.location.protocol}//bloghouse-pifs.onrender.com//user`;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/blogs");
        }
    }, [navigate]);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showAlert("Email and password are required.", "error");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/login`, { email, password });

            if (response.status === 200) {
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem("token", response.data.token);
                navigate('/blogs');
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            showAlert('Login failed! Please check your email and password.', "error");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmpassword) {
            showAlert("All fields are required.", "error");
            return;
        }

        if (password !== confirmpassword) {
            showAlert("Passwords do not match.", "error");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/signup`, {
                name,
                email,
                password,
                confirmpassword
            });

            if (response.status === 201) {
                showAlert("Registration successful!", "success");
                resetForm();
                const loginResponse = await axios.post(`${baseURL}/login`, { email, password });

                if (loginResponse.status === 200) {
                    localStorage.setItem("userName", loginResponse.data.name);
                    localStorage.setItem("token", loginResponse.data.token);
                    setIsLogin(true);
                    navigate('/');
                }
            }
        } catch (err) {
            console.error("Registration error:", err.response?.data || err.message);
            if (err.response && err.response.status === 409) {
                showAlert("Email already exists. Please use a different email.", "error");
            } else {
                showAlert("Registration failed. Please try again.", "error");
            }
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
    };

    return (
        <div className="login-container">
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            {isLogin ? (
                <form className='login-form' onSubmit={handleLogin}>
                    <h2 className='login-title'>Sign In</h2>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-button" type="submit">Login</button>
                    <div className="login-separator">
                        <button
                            className='herfbutton'
                            type="button"
                            onClick={() => {
                                setIsLogin(false);
                                resetForm();
                            }}
                        >
                            New User?
                        </button>
                        <button className='herfbutton'
                            type="button"
                            onClick={() => showAlert("Password recovery is not done yet.", "error")}
                        >Forgot Password?</button>
                    </div>
                </form>
            ) : (
                <form className='login-form' onSubmit={handleRegister}>
                    <h2 className='login-title'>Sign Up</h2>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button className="login-button" type="submit">Sign Up</button>
                    <div className="register-separator">
                        <button
                            className='herfbutton'
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                resetForm();
                            }}
                        >
                            Already have an account?
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Login;
