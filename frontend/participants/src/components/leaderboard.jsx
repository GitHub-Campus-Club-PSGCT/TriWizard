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

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080"; // ✅ Environment variable
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHouses(data); // data is array of {houseName, teams: [...]}
    };

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
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
