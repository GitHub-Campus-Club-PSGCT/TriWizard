import React, { useEffect, useState } from "react";
import axios from "axios";
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
    axios.get("http://localhost:8080/admin/teams") // 👈 change if your backend route differs
      .then(res => {
        setHouses(res.data); // expect backend to return { houseName, teams: [{name, score}] }
      })
      .catch(err => console.error("Error fetching leaderboard:", err));
       // Connect WebSocket
        const ws = new WebSocket("ws://localhost:8080");

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setHouses(data); // update leaderboard live
        };

        ws.onopen = () => console.log("Connected to WebSocket");
        ws.onclose = () => console.log("WebSocket disconnected");

        return () => ws.close(); // cleanup on unmount
  }, []);

  return (
    <div className="leaderboard">
      {/* Snitches flying */}
      <div className="snitch-container snitch-1"><Snitch /></div>
      <div className="snitch-container snitch-2"><Snitch /></div>
      <div className="snitch-container snitch-3"><Snitch /></div>

      <h1 className="main-title">Triwizard Tournament Leaderboard 🪄</h1>
      <p className="status online">The Tournament is Live!</p>

      <div className="houses">
        {houses.map(house => (
          <div key={house.houseName} className={`house-box ${house.houseName}`}>
            <h2 className="house-title">{house.houseName}</h2>
            <div className="teams">
              {house.teams
                .sort((a, b) => b.score - a.score)
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