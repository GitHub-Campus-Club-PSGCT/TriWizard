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
      "You’ve got the heart of a true lion, Gryffindor! Stand tall and brave!",
      "Bravery is not the absence of fear—it’s rising above it every single time!",
      "Dumbledore himself would beam at your courage and daring feats!",
      "Your fire burns brighter than any spell ever cast in the darkest nights!",
      "Even in times of shadow, courage lights the path forward!",
      "Gryffindor roars with pride because of your unyielding spirit!",
      "Harry salutes your fearless soul and relentless bravery!"
    ],
  },
  Slytherin: {
    name: "Draco Malfoy",
    img: dracoImg,
    gradient: "linear-gradient(135deg, #1A472A, #C0C0C0)",
    bg: slytherinBg,
    messages: [
      "Ambition shapes your destiny—Slytherin, rise with cunning and pride!",
      "Every clever move you make paves the path to greatness!",
      "Cunning minds like yours bend fate with sharp wit and resolve!",
      "Your strength of character proves that Slytherins always triumph!",
      "Salazar himself would admire your skill and clever determination!",
      "The serpent coils with pride at your relentless drive and ambition!",
      "Victory favors the bold and clever, just like you today!"
    ],
  },
  Ravenclaw: {
    name: "Luna Lovegood",
    img: lunaImg,
    gradient: "linear-gradient(135deg, #0E1A40, #CD7F32)",
    bg: ravenclawBg,
    messages: [
      "Loyalty, kindness, and dedication define a true Hufflepuff!",
      "Hard work is the strongest form of magic, and you wield it well!",
      "Hufflepuffs stand tall, fair, and brave, just like you today!",
      "Dedication and patience have brought you to this shining moment!",
      "Even Helga herself would smile at your unwavering spirit!",
      "Your fairness and courage inspire everyone around you!",
      "The badger nods with pride because your heart shines brightly!"
    ],
  },
  Hufflepuff: {
    name: "Cedric Diggory",
    img: cedricImg,
    gradient: "linear-gradient(135deg, #FFDB58, #000000)",
    bg: hufflepuffBg,
    messages: [
      "Loyalty, kindness, and dedication define a true Hufflepuff!",
      "Hard work is the strongest form of magic, and you wield it well!",
      "Hufflepuffs stand tall, fair, and brave, just like you today!",
    ],
  },
};

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
