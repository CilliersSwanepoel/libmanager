import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './assets/logo.png'; 

function Header() {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item"><Link to="/">Book Catalog</Link></li>
                <li className="nav-item"><Link to="/users">User Management</Link></li>
                <li className="nav-item"><Link to="/circulation">Circulation Management</Link></li>
                <li className="nav-item"><Link to="/fines">Fine Management</Link></li>
            </ul>
            <img src={logo} alt="Logo" className="navbar-logo" />
        </nav>
    );
}

export default Header;