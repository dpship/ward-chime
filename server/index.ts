import express from "express";
import cors from "cors";
import { initDatabase } from "./db";
import billsRouter from "./routes/bills";

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bills", billsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
console.log("Starting server...");
console.log("PORT:", PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set (hidden)" : "Not set");

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize database after server is listening (non-blocking)
  initDatabase().then((success) => {
    if (success) {
      console.log("Database ready");
    } else {
      console.log("Database initialization failed - will retry on requests");
    }
  });
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
