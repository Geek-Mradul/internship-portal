// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
            <Link to="/">Home</Link>
            {token ? (
                <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
            ) : (
                <div style={{ float: 'right' }}>
                    <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
                    <Link to="/signup">Signup</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;