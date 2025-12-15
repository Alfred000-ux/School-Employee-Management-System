import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    ...(isAdmin() ? [
      { label: 'Employees', path: '/employees' },
      { label: 'Add Employee', path: '/employees/new' },
    ] : []),
    { label: 'Leave Requests', path: '/leave-requests' },
    { label: 'New Leave Request', path: '/leave-requests/new' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="navbar-title">
            School Employee Management
          </Link>
        </div>

        <div className="navbar-menu-toggle" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>

        <ul className={`navbar-menu ${isMenuOpen ? 'navbar-menu--open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="navbar-item">
              <Link
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'navbar-link--active' : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="navbar-item">
            <button className="navbar-link navbar-logout" onClick={() => { logout(); closeMenu(); }}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
