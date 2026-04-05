require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/connectDb"); // MongoDB connection

// Routes

const usersRoute = require("./routes/user.routes");
const roleRoute = require("./routes/role.routes");
const taskRoute = require("./routes/task.routes");
const app = express();

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://dhruvermafz.vercel.app",
      "https://dhruvermafz.in",
      "https://task-manager-assignment-rose.vercel.app",
      // add more origins if needed in the future
    ],
    credentials: true,
  }),
);

// ────────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────────
app.use("/api/user", usersRoute);
app.use("/api/roles", roleRoute);
app.use("/api/tasks", taskRoute);

// ────────────────────────────────────────────────
// Start Server (only after MongoDB connects)
// ────────────────────────────────────────────────
const port = process.env.API_PORT || 8000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected successfully");

    // Start Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API Documentation: http://localhost:${port}/docs`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    console.error("Server will NOT start due to database connection failure.");
    process.exit(1);
  }
};

startServer();
