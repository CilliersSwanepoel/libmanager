import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';


function Header() {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item"><Link to="/">Book Catalog</Link></li>
                <li className="nav-item"><Link to="/users">User Management</Link></li>
                <li className="nav-item"><Link to="/circulation">Circulation Management</Link></li>
                <li className="nav-item"><Link to="/notifications">Notifications</Link></li>
                <li className="nav-item"><Link to="/search">Search</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
