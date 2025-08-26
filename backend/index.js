const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

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

// Import combined routes
const routes = require("./routes");
const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

const emailRoutes = require("./routes/emailRoutes");
app.use("/api/email", emailRoutes);

const teamRoutes = require("./routes/admin");
app.use("/admin", teamRoutes);

const questionRoutes = require("./routes/questions");
app.use("/questions", questionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

