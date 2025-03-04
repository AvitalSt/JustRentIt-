import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="Logo" className="logo-img" />
                </Link>

                <div className="navbar-toggle" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links">עמוד הבית</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/dresses" className="nav-links">קטלוג שמלות</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/upload" className="nav-links">הוספת שמלה</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-links">מידע על האתר</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;