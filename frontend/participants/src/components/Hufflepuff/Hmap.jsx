// MapPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HMapPage.css';
import mapImage from '../../assets/Images/hufflepuffMap.png';

const MapPage = () => {
  const locations = [
    { id: 1, top: '18%', left: '16%', width: '9%', height: '14%', name: 'Hufflepuff Basement' },
    { id: 2, top: '56%', left: '13%', width: '13%', height: '12%', name: 'Herbology Greenhouse' },
    { id: 3, top: '75%', left: '27%', width: '12%', height: '12%', name: 'Kitchen by the Barrel' },
    { id: 4, top: '80%', left: '54%', width: '9%', height: '8%', name: 'Magical Creatures Pen' },
    { id: 5, top: '75%', left: '70%', width: '12%', height: '12%', name: 'Leaky Cauldron' },
    { id: 6, top: '24%', left: '72%', width: '11%', height: '10%', name: "Badger's Tunnel" },
    { id: 7, top: '39%', left: '43%', width: '15%', height: '20%', name: 'The Great Hall' },
  ];

  return (
    <div className="map-page hufflepuff">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <div className="nav-logo">HUFFLEPUFF</div>
        <div className="nav-actions">
          <Link to="/rules">
            <button>Rules</button>
          </Link>
          <Link to="/ld">
            <button>Leaderboard</button>
          </Link>
        </div>
      </nav>

      {/* ✅ Map Container */}
      <div className="map-container">
        <img src={mapImage} alt="Hufflepuff Trail Map" className="map-image" />
        {locations.map(loc => (
          <Link
            key={loc.id}
            to={`/ide/Hufflepuff/${loc.id}`}
            className="map-hotspot"
            style={{
              top: loc.top,
              left: loc.left,
              width: loc.width,
              height: loc.height,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MapPage;
