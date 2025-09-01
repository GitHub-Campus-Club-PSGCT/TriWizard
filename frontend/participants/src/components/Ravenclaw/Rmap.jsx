import React from 'react';
import { Link } from 'react-router-dom';
import './RMapPage.css'; // Using the new Ravenclaw CSS file
import mapImage from '../../assets/Images/ravenclawMap.png'; // The new map image

const RMapPage = () => {
  // ✅ New coordinates and names for the Ravenclaw locations
  const locations = [
    { id: 1, top: '13%', left: '13%', width: '15%', height: '22%', name: 'Ravenclaw Common Room Door' },
    { id: 2, top: '50%', left: '17%', width: '11%', height: '18%', name: 'Astronomy Tower' },
    { id: 3, top: '79%', left: '20%', width: '13%', height: '15%', name: 'Charms Classroom Function bug' },
    { id: 4, top: '75%', left: '41%', width: '18%', height: '15%', name: 'Library - Restricted Section' },
    { id: 5, top: '67%', left: '69%', width: '13%', height: '15%', name: 'Arithmancy Class' },
    { id: 6, top: '20%', left: '69%', width: '14%', height: '20%', name: 'Eagle Tower Balcony' },
    { id: 7, top: '34%', left: '42%', width: '18%', height: '25%', name: 'The Great Hall Entrance' },
  ];

  return (
    <div className="map-page ravenclaw"> {/* ✅ Updated class name for Ravenclaw */}
      <nav className="navbar">
        <div className="nav-logo">RAVENCLAW</div> {/* ✅ Updated House Name */}
        <div className="nav-actions">
          <Link to="/rules">
            <button>Rules</button>
          </Link>
          <Link to="/ld">
            <button>Leaderboard</button>
          </Link>
        </div>
      </nav>

      <div className="map-container">
        <img src={mapImage} alt="Ravenclaw Trail Map" className="map-image" />
        {locations.map(loc => (
          <Link
            key={loc.id}
            to={`/ide/Ravenclaw/${loc.id}`}
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

export default RMapPage;