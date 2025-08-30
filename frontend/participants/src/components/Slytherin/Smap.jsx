import React from 'react';
import { Link } from 'react-router-dom';
import './SMapPage.css'; // Using the new Slytherin CSS file
import mapImage from '../../assets/Images/slytherinMap.png'; // The new map image

const SMapPage = () => {
  // ✅ New coordinates and names for the Slytherin locations
  const locations = [
    { id: 1, top: '21%', left: '22%', width: '15%', height: '20%', name: 'Slytherin Dungeon' },
    { id: 2, top: '53%', left: '24%', width: '13%', height: '14%', name: 'Potions Classroom' },
    { id: 3, top: '78%', left: '28%', width: '20%', height: '15%', name: 'Black Lake Shore' },
    { id: 4, top: '80%', left: '60%', width: '12%', height: '12%', name: 'Room of Hidden Secrets' },
    { id: 5, top: '72%', left: '76%', width: '16%', height: '18%', name: 'The Chamber\'s Entrance' },
    { id: 6, top: '32%', left: '75%', width: '14%', height: '18%', name: 'Malfoy Manor' },
    { id: 7, top: '47%', left: '50%', width: '18%', height: '25%', name: 'The Great Hall' },
  ];

  return (
    <div className="map-page">
      <nav className="navbar">
        <div className="nav-logo">SLYTHERIN</div> {/* ✅ Updated House Name */}
        <div className="nav-actions">
          <Link to="/rules">
            <button>Rules</button>
          </Link>
          <Link to="/leaderboard">
            <button>Leaderboard</button>
          </Link>
        </div>
      </nav>

      <div className="map-container">
        <img src={mapImage} alt="Slytherin Trail Map" className="map-image" />
        {locations.map(loc => (
          <Link
            key={loc.id}
            to={`/debug/${loc.id}`}
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

export default SMapPage;