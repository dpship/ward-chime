import { Pool } from "pg";
import dotenv from "dotenv";

// Only load .env file in development (Render sets env vars directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Support both DATABASE_URL (for cloud) and individual params (for local)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Always use SSL for cloud databases
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "ward_chime",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
    };

console.log("Connecting to database...", process.env.DATABASE_URL ? "Using DATABASE_URL" : "Using individual params");

export const pool = new Pool(poolConfig);

// Initialize database schema
export async function initDatabase() {
  const client = await pool.connect();

  try {
    // Test connection first
    await client.query("SELECT NOW()");
    console.log("Database connected successfully");

    // Create bills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        bill_number VARCHAR(50) UNIQUE NOT NULL,
        patient_name VARCHAR(100) NOT NULL,
        mobile_number VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        patient_type VARCHAR(10) NOT NULL,
        registration_number VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Bills table ready");

    // Create procedures table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bill_procedures (
        id SERIAL PRIMARY KEY,
        bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
        procedure_name VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Bill procedures table ready");

    console.log("Database initialization complete");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
}
