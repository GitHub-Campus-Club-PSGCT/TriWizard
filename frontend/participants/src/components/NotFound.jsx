import React from 'react';
import { Link } from 'react-router-dom';
import '../components-css/NotFound.css';
import dumbledore from '../assets/dumbledore.png';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <img src={dumbledore} alt="Lost in Hogwarts" className="not-found-image" />
            <h1>404 - Page Vanished!</h1>
            <p>
                "Curious... it seems you've wandered off the Marauder's Map. This page has performed a perfect Disillusionment Charm."
            </p>
            <p>
                Let's use a Portkey to get you back to safety.
            </p>
            <Link to="/login" className="back-to-safety-button">
                Return to Login
            </Link>
        </div>
    );
};

export default NotFound;