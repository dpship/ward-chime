import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./db";
import billsRouter from "./routes/bills";

dotenv.config();

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

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
