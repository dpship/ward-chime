import { Pool, PoolConfig } from "pg";

// Log environment for debugging
console.log("Database module loaded");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- DATABASE_URL set:", !!process.env.DATABASE_URL);

// Build pool config
let poolConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  console.log("Will use DATABASE_URL for connection");
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else {
  console.log("Will use individual params for connection");
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "ward_chime",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  };
}

// Lazy pool initialization
let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool(poolConfig);
    _pool.on("error", (err) => {
      console.error("Database pool error:", err);
    });
  }
  return _pool;
}

// For backwards compatibility
export const pool = {
  query: (...args: Parameters<Pool["query"]>) => getPool().query(...args),
  connect: () => getPool().connect(),
};

// Initialize database schema
export async function initDatabase(): Promise<boolean> {
  try {
    const client = await getPool().connect();

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
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}
