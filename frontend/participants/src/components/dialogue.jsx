import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../components-css/dialogue.css";
import harryImg from "../assets/harry.png";
import dracoImg from "../assets/draco.png";
import lunaImg from "../assets/luna.png";
import cedricImg from "../assets/cedric.png";

import gryffindorBg from "../assets/gryffindorMap.png";
import slytherinBg from "../assets/slytherinMap.png";
import ravenclawBg from "../assets/ravenclawMap.png";
import hufflepuffBg from "../assets/hufflepuffMap.png";

const houseCharacters = {
  Gryffindor: {
    name: "Harry Potter",
    img: harryImg,
    gradient: "linear-gradient(135deg, #7f0d0d, #ffd700)",
    bg: gryffindorBg,
    messages: [
      "Good start! That bug didn’t stand a chance against you. Keep pushing — the harder it gets, the stronger you’ll grow.",
      "Yes! Another bug falls. Don’t stop — imagine the victory at the end driving you forward.",
      "Halfway to glory! Push harder now, because Gryffindors shine brightest under pressure.",
      "Halfway! Don’t look back — keep fighting forward like a true lion.",
      "Yes! Five down. You’re nearly there — keep burning with courage!",
      "One step away from victory. Give it everything you’ve got!",
      "You did it! This is what courage and determination look like — be proud."
    ]
  },
  Slytherin: {
    name: "Draco Malfoy",
    img: dracoImg,
    gradient: "linear-gradient(135deg, #1A472A, #C0C0C0)",
    bg: slytherinBg,
    messages: [
       "One down and you already look proud? Pathetic. Let’s see if you crawl past the next one.",
       "Managed another? Don’t get too excited — even trolls can smash through easy bugs.",
       "Still clinging on? I almost admire it. But don’t mistake persistence for actual skill.",
      "Halfway, and you look like you’ve run a marathon. Are you even cut out for this?",
      "Five down. Impressive… for a first-year. Real Slytherins would’ve finished long ago.",
      "Nearly done, but don’t celebrate yet. I’d hate to watch you choke at the very end.",
      "Well, well… you actually survived. I’ll admit, I didn’t think you had it in you. Don’t let it go to your head."
    ]
  },
  Ravenclaw: {
    name: "Luna Lovegood",
    img: lunaImg,
    gradient: "linear-gradient(135deg, #0E1A40, #CD7F32)",
    bg: ravenclawBg,
    messages: [
      "Lovely! That bug fluttered away like a Nargle. Strange things unravel when you notice patterns, keep noticing.",
      "Two bugs gone! It’s like unraveling a tapestry; each thread reveals the whole picture.",
      "Three is such a magical number, don’t you think? Patterns are aligning, trust your instincts.",
      "Four solved. It’s almost like the puzzle wanted to be your friend all along.",
      "Five feels balanced, like the stars aligning. Keep reaching for what’s just out of sight.",
      "Six is a curious number, it wobbles a bit — don’t let your focus wobble with it.",
      "How wonderful… the last bug slipped away like a dream fading at dawn. But you caught it! Brilliant!"
    ]
  },
  Hufflepuff: {
    name: "Cedric Diggory",
    img: cedricImg,
    gradient: "linear-gradient(135deg, #FFDB58, #635555ff)", // yellow + black
    bg: hufflepuffBg,
    messages: [
      "Solid work. Stay steady — consistency will win this round, not just speed.",
      "Nice progress. Remember, pace yourself — the cleverest coder balances focus with calm.",
      "That’s real progress. Keep your mind clear — the toughest challenges are yet to come.",
      "Strong work. Stay grounded — don’t let pressure cloud your judgment now.",
      "Excellent. This is where many stumble — stay calm, keep steady.",
      "Nearly there. Don’t rush, precision matters more than speed now.",
      "Well done! You’ve proven focus and resilience win the day. Be proud of your steady climb."
    ]
  }
};

// Animation variants for word fade-in
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const child = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DialoguePage({ teamName, message }) {
  const { house } = useParams();
  const navigate = useNavigate();
  const character = houseCharacters[house];

  const randomMessage =
    character.messages[Math.floor(Math.random() * character.messages.length)];
  const finalMessage =
    message || `${randomMessage} ${teamName ? `(${teamName})` : ""}`;
  const words = finalMessage.split(" ");

  const mapRoute = `/${house.toLowerCase()}/map`;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${character.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Character image */}
        <img
          src={character.img}
          alt={character.name}
          style={{ height: "100vh", objectFit: "contain" }}
        />

        {/* Dialogue box */}
            <div
              style={{
                position: "relative",
                background: character.gradient,
                color: house === "Hufflepuff" ? "#000" : "#fff",
                border: `4px solid rgba(255,255,255,0.7)`,
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                maxWidth: "700px",
                fontSize: "1.2rem",
                fontWeight: "500",
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                boxShadow: "0 0 25px rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
              }}
            >
          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontFamily: "'Cinzel', serif", fontWeight: "600" }}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={child}>
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Next button */}
          <button
            onClick={() => navigate(mapRoute)}
            style={{
              marginTop: "0.5rem",
              padding: "12px 36px",
              borderRadius: "40px",
              border: "2px solid #fff",
              background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1.05rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "1px",
              cursor: "pointer",
              boxShadow:
                "0 0 15px rgba(255,255,255,0.7), 0 0 35px rgba(255,255,255,0.5)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.1)";
              e.target.style.boxShadow =
                "0 0 25px rgba(255,255,255,1), 0 0 55px rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow =
                "0 0 15px rgba(255,255,255,0.7), 0 0 35px rgba(255,255,255,0.5)";
            }}
          >
            ✦ Next ✦
          </button>
        </div>
      </div>
    </div>
  );
}
