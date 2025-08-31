import React from 'react';
import { Link } from 'react-router-dom';
import './GMapPage.css'; // Using the new Gryffindor CSS file
import mapImage from '../../assets/Images/gryffindorMap.png'; // The new map image

const GMapPage = () => {
  // ✅ New coordinates and names for the Gryffindor locations
  const locations = [
    { id: 1, top: '35%', left: '22%', width: '15%', height: '22%', name: 'Common Room Fireplace' },
    { id: 2, top: '77%', left: '20%', width: '16%', height: '18%', name: 'Quidditch Pitch' },
    { id: 3, top: '86%', left: '38%', width: '13%', height: '14%', name: 'Forbidden Forest Edge' },
    { id: 4, top: '84%', left: '59%', width: '12%', height: '15%', name: 'The Owlery' },
    { id: 5, top: '79%', left: '74%', width: '16%', height: '15%', name: 'Triwizard Maze' },
    { id: 6, top: '35%', left: '74%', width: '14%', height: '20%', name: 'Tower Stairs' },
    { id: 7, top: '47%', left: '50%', width: '18%', height: '25%', name: 'The Great Hall' },
  ];

  return (
    <div className="map-page gryffindor"> {/* ✅ Updated class name for Gryffindor */}
      <nav className="navbar">
        <div className="nav-logo">GRYFFINDOR</div> {/* ✅ Updated House Name */}
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
        <img src={mapImage} alt="Gryffindor Trail Map" className="map-image" />
        {locations.map(loc => (
          <Link
            key={loc.id}
            to={`/gryffindor/debug/${loc.id}`}
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

export default GMapPage;