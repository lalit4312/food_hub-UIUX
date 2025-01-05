import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { StoreContext } from './../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currentState, setCurrentState] = useState('Login');
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const resetForm = () => {
        setData({
            name: '',
            email: '',
            password: '',
            phone: '',
        });
        setError('');
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        setError(''); // Clear error when user types
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${url}/api/user/register`, data);

            if (response.data.success) {
                alert('Registration successful! Please login to continue.');
                setCurrentState('Login');
                resetForm();
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${url}/api/user/login`, {
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setShowLogin(false);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (currentState === 'Login') {
                await handleLogin();
            } else {
                await handleRegister();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setShowLogin(false);
        navigate('/forgot_password');

    };

    return (
        <div className="login-popup">
            <form onSubmit={onSubmitHandler} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <button
                        type="button"
                        onClick={() => setShowLogin(false)}
                        className="close-btn"
                    >
                        &times;
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="login-popup-inputs">
                    {currentState === 'Sign Up' && (
                        <input
                            name="name"
                            value={data.name}
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}

                    <input
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        type="email"
                        placeholder="Your email"
                        required
                        formNoValidate
                    />

                    {currentState === 'Sign Up' && (
                        <input
                            name="phone"
                            value={data.phone}
                            onChange={onChangeHandler}
                            type="tel"
                            placeholder="Your phone number"
                            required
                        />
                    )}

                    <div className="password-field-container">
                        <div className="password-input-wrapper">
                            <input
                                name="password"
                                value={data.password}
                                onChange={onChangeHandler}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                minLength={8}
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <i className="fas fa-eye-slash"></i>
                                ) : (
                                    <i className="fas fa-eye"></i>
                                )}
                            </span>
                        </div>
                        {currentState === 'Login' && (
                            <div className="forgot-password-container">
                                <span
                                    className="forgot-password-link"
                                    onClick={handleForgotPassword}
                                >
                                    Forgot Password?
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className='login_btn'
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Please wait...'
                        : currentState === 'Sign Up'
                            ? 'Create Account'
                            : 'Login'
                    }
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>

                {currentState === 'Login' ? (
                    <p>
                        Create a new account?{' '}
                        <span
                            className='click_here'
                            onClick={() => {
                                setCurrentState('Sign Up');
                                resetForm();
                            }}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <span
                            className='login_here'
                            onClick={() => {
                                setCurrentState('Login');
                                resetForm();
                            }}
                        >
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;