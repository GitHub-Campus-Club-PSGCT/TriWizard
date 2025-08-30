const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

// Connect DB once
// connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend dev origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies
  })
);

// Routes
app.use("/api/auth", require("./routes/login"));
app.use("/api/email", require("./routes/emailRoutes"));
app.use("/admin", require("./routes/admin"));
app.use("/questions", require("./routes/questions"));
app.use("/submission", require("./routes/submission"));
app.use("/", require("./routes/codeRunner")); // handles code execution
app.use("/", require("./routes")); // any general routes

// Save code to file
app.post("/submit", async (req, res) => {
  try {
    const { code } = req.body;
    const filePath = path.join(__dirname, "submitted.c");
    fs.writeFileSync(filePath, code);
    res.json({ success: true, message: "Code saved successfully", filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving code" });
  }
});

// Run submitted code inside Docker
app.post("/run-code", (req, res) => {
  //when there are concurrent requests, there will be an issue. 
  const { code } = req.body;
  // to handle concurrent requests use some submission ids or use team_id. For example <team_id_submitted.c> for the filename. 
  const filePath = path.join(__dirname, "submitted.c");
  fs.writeFileSync(filePath, code);

  let command;
  if (process.platform === "win32") {
    command = "gcc submitted.c -o submitted && submitted";
  } else {
    command = "gcc submitted.c -o submitted && ./submitted";
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({
        success: false,
        error: stderr || error.message
      });
    }
    res.json({ success: true, output: stdout });
  });
});

// Secondary Mongo connection (if you're using connectDB already, you can remove this)
// commented this as we are already calling the connectDB() function at the beginning of this file
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check
app.get("/", (req, res) => {
  res.send("Hello from server 🚀");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
