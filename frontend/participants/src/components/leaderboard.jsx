import React, { useEffect, useState } from "react";
import "../components-css/leaderboard.css";

const Snitch = React.memo(() => (
  <svg className="snitch" viewBox="0 0 200 100">
    <g className="wings">
      <path className="wing" d="M50,50 Q20,20 0,50 Q20,80 50,50 Z" />
      <path className="wing" d="M150,50 Q180,20 200,50 Q180,80 150,50 Z" />
    </g>
    <circle className="body" cx="100" cy="50" r="15" />
  </svg>
));

export default function Leaderboard() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch leaderboard data from REST API
  const fetchLeaderboard = async () => {
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/api/leaderboard`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHouses(result.data);
        setLastUpdated(new Date(result.timestamp));
        setError(null);
      } else {
        throw new Error(result.message || "Failed to fetch leaderboard");
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="leaderboard">
      {/* Flying Snitches */}
      <div className="snitch-container snitch-1"><Snitch /></div>
      <div className="snitch-container snitch-2"><Snitch /></div>
      <div className="snitch-container snitch-3"><Snitch /></div>

       <div className="nav-header">
        <button onClick={handleGoBack} className="back-button">
          &larr; Back
        </button>

        <h1 className="main-title">&emsp;Triwizard Tournament Leaderboard </h1>
      </div>
      <br />
      <br />

      {/* Loading State */}
      {loading && (
        <div className="status">
          <p>Loading leaderboard...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="status offline">
          <p>Error: {error}</p>
          <button onClick={fetchLeaderboard} className="back-button" style={{marginTop: '10px'}}>
            Retry
          </button>
        </div>
      )}

      {/* Last Updated Info */}
      {lastUpdated && !loading && !error && (
        <div className="status online">
          <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
      )}

      <div className="houses">
        {houses.map((house) => (
          <div key={house.houseName} className={`house-box ${house.houseName}`}>
            <h2 className="house-title">{house.houseName}</h2>

            <div className="teams">
              {house.teams
                .sort((a, b) => b.score - a.score) // sort within the house
                .map((team, idx) => (
                  <div
                    key={team.name}
                    className={`team-card ${idx === 0 ? "first-place" : ""}`}
                  >
                    <span className="team-rank">{idx + 1}</span>
                    <span className="team-name">{team.name}</span>
                    <span className="team-score">{team.score}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
