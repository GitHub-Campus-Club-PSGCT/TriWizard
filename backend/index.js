const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const Team = require("./models/Team"); // your Team model

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true
  })
);

// Routes (keep all your existing routes)
app.use("/api/auth", require("./routes/login"));

app.use("/api/email", require("./routes/emailRoutes"));
app.use("/admin", require("./routes/admin"));
app.use("/questions", require("./routes/questions"));
app.use("/submission", require("./routes/submission"));
app.use("/", require("./routes/codeRunner"));
app.use("/", require("./routes"));

// Save code
app.post("/submit", async (req,res)=>{
  try{
    const {code} = req.body;
    const filePath = path.join(__dirname,"submitted.c");
    fs.writeFileSync(filePath,code);
    res.json({success:true,message:"Code saved",filePath});
  }catch(err){
    console.error(err);
    res.status(500).json({success:false,message:"Error saving code"});
  }
});

// Run code in Docker
app.post("/run-code", (req,res)=>{
  const {code} = req.body;
  const filePath = path.join(__dirname,"submitted.c");
  fs.writeFileSync(filePath, code);

  const command = `docker run --rm -v ${__dirname}:/app -w /app gcc:latest sh -c "gcc submitted.c -o submitted && ./submitted"`;

  exec(command,(error,stdout,stderr)=>{
    if(error) return res.json({success:false,error: stderr||error.message});
    res.json({success:true, output:stdout});
  });
});

app.get("/", (req, res) => {
  res.send("Hello from server 🚀 - Triwizard");
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, ()=> console.log(`✅ Server running on http://localhost:${PORT} with WebSocket`));

module.exports.broadcastLeaderboard = broadcastLeaderboard;

