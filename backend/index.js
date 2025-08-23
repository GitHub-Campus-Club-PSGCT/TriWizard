const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());

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

