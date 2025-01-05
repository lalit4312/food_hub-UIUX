import React from 'react';
import './Header.css';
import { Link } from 'react-scroll';

const Header = () => {
    return (
        <div className="header">
            <div className="header-contents">
                <h2>Order your favourite food here</h2>
                <p>Surf your favorite food and have a taste of your wise.</p>
                <Link to="explore-menu" smooth={true} duration={50}>
                    <button>View Menu</button>
                </Link>
            </div>
        </div>
    );
};

export default Header;
