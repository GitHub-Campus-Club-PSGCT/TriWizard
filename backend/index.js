const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { exec } = require("child_process");

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Import combined routes
const authRoutes = require("./routes/login");
app.use("/api/auth", authRoutes);
const routes = require("./routes");
const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

const emailRoutes = require("./routes/emailRoutes");
app.use("/api/email", emailRoutes);

const teamRoutes = require("./routes/admin");
app.use("/admin", teamRoutes);

const questionRoutes = require("./routes/questions");
app.use("/questions", questionRoutes);

const submissionRoutes = require("./routes/submission");
app.use("/submission", submissionRoutes);

const fs = require("fs");
const path = require("path");

app.post("/submit", async (req, res) => {
  try {
    const { code } = req.body; // frontend sends changed C code
    const filePath = path.join(__dirname, "submitted.c");

    // Save code to a file
    fs.writeFileSync(filePath, code);

    res.json({ success: true, message: "Code saved successfully", filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving code" });
  }
});


app.post("/run-code", (req, res) => {
  const { code } = req.body;

  // Save the submitted code to submitted.c
  const fs = require("fs");
  const filePath = path.join(__dirname, "submitted.c");
  fs.writeFileSync(filePath, code);

  // Run Docker command
  const command = `docker run --rm -v ${__dirname}:/app -w /app gcc:latest sh -c "gcc submitted.c -o submitted && ./submitted"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({ success: false, error: stderr || error.message });
    }
    res.json({ success: true, output: stdout });
  });
});


const Question = require("./models/Question");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const codeRunnerRoutes = require("./routes/codeRunner");
app.use("/", codeRunnerRoutes);

app.get("/", (req, res) => {
  res.send("Hello from server");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));