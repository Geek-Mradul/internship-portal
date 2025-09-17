// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h2>Welcome to the Internship Portal</h2>
            <p>Find your next opportunity or discover new talent.</p>
            <nav>
                <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
            </nav>
        </div>
    );
};

export default HomePage;