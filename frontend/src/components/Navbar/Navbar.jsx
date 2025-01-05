import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import { assets } from "./../../assets/assets";
import { FaHome, FaList, FaSearch, FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { StoreContext } from './../context/StoreContext';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">

                <Link
                    to="/"
                    className="logo-container"
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigation from default Link behavior
                        window.location.href = "/"; // Set the location to home
                    }}
                >
                    <img src={assets.logo} alt="FoodHub Logo" className="logo" />
                </Link>

                <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                <div className={`navbar-content ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul className="navbar-menu">

                        <li
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation from default Link behavior
                                setMenu("home");
                                window.location.href = "/"; // Set the location to home
                            }}
                            className={menu === "home" ? "active" : ""}
                        >
                            <Link to="/">
                                <div className="menu-item">
                                    <FaHome size={20} />
                                    <span>Home</span>
                                </div>
                            </Link>
                        </li>
                        <li
                            onClick={() => handleMenuClick("menu")}
                            className={menu === "menu" ? "active" : ""}
                        >
                            <ScrollLink to="explore-menu" smooth={true} duration={50}>
                                <div className="menu-item">
                                    <FaList size={20} />
                                    <span>Menu</span>
                                </div>
                            </ScrollLink>
                        </li>
                    </ul>

                    <div className="navbar-right">
                        <Link to='/search' onClick={() => setIsMobileMenuOpen(false)}>
                            <FaSearch className="icon" size={20} alt="Search" />
                        </Link>
                        <div className="navbar-search-icon">
                            <Link to='/cart' onClick={() => setIsMobileMenuOpen(false)}>
                                <FaShoppingCart className="icon" size={20} alt="Cart" />
                                {getTotalCartAmount() > 0 && <div className="cart-badge"></div>}
                            </Link>
                        </div>
                        {!token ? (
                            <button
                                className="sign-in-btn"
                                onClick={() => {
                                    setShowLogin(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className='navbar-profile'>
                                <Link to='/profile'>
                                    <FaUser alt="Profile Icon" className="profile-icon" />
                                </Link>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;