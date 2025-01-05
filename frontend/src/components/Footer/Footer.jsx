import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { FaFacebook, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="Logo" className="footer-logo" />
                    <p>Take a look at our tasty dishes made fresh every day. Whether you're in the mood for something spicy, sweet, or hearty, we've got something you'll love. Find your next favorite meal today!</p>
                    <div className="footer-social-icons">
                        <a href="#" className="social-icon">
                            <FaFacebook />
                        </a>
                        <a href="#" className="social-icon">
                            <FaTwitter />
                        </a>
                        <a href="#" className="social-icon">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Company</h2>
                    <ul>
                        <p>
                            our company serve you the best product that you will not get any chance to complain about it.
                        </p>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>Contact Info</h2>
                    <ul>
                        <li>
                            <FaPhone className="contact-icon" />
                            <span>+977 9823416561</span>
                        </li>
                        <li>
                            <FaEnvelope className="contact-icon" />
                            <span>goldenbug1122@gmail.com</span>
                        </li>
                        <li>
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>Kathmandu, Nepal</span>
                        </li>
                    </ul>
                </div>
            </div>
            <hr />
            <div className="footer-bottom">
                <p className="footer-copyright">
                    Copyright 2024 &copy; LalitSaud - All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer