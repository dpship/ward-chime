import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Support both DATABASE_URL (for cloud) and individual params (for local)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "ward_chime",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
    };

export const pool = new Pool(poolConfig);

// Test connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Database connected:", res.rows[0].now);
  }
});

// Initialize database schema
export async function initDatabase() {
  const createTablesSQL = `
    -- Bills table
    CREATE TABLE IF NOT EXISTS bills (
      id SERIAL PRIMARY KEY,
      bill_number VARCHAR(50) UNIQUE NOT NULL,
      patient_name VARCHAR(100) NOT NULL,
      mobile_number VARCHAR(15) NOT NULL,
      address TEXT NOT NULL,
      patient_type VARCHAR(10) NOT NULL CHECK (patient_type IN ('IPD', 'OPD')),
      registration_number VARCHAR(50) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Procedures table (linked to bills)
    CREATE TABLE IF NOT EXISTS bill_procedures (
      id SERIAL PRIMARY KEY,
      bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
      procedure_name VARCHAR(255) NOT NULL,
      cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_bills_bill_number ON bills(bill_number);
    CREATE INDEX IF NOT EXISTS idx_bills_registration_number ON bills(registration_number);
    CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at);
  `;

  try {
    await pool.query(createTablesSQL);
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
