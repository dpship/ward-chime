// server/index.ts
import express from "express";
import cors from "cors";

// server/db.ts
import { Pool } from "pg";
console.log("Database module loaded");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- DATABASE_URL set:", !!process.env.DATABASE_URL);
var poolConfig;
if (process.env.DATABASE_URL) {
  console.log("Will use DATABASE_URL for connection");
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  console.log("Will use individual params for connection");
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "ward_chime",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || ""
  };
}
var _pool = null;
function getPool() {
  if (!_pool) {
    _pool = new Pool(poolConfig);
    _pool.on("error", (err) => {
      console.error("Database pool error:", err);
    });
  }
  return _pool;
}
var pool = {
  query: (...args) => getPool().query(...args),
  connect: () => getPool().connect()
};
async function initDatabase() {
  try {
    const client = await getPool().connect();
    try {
      await client.query("SELECT NOW()");
      console.log("Database connected successfully");
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

// server/routes/bills.ts
import { Router } from "express";
var router = Router();
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      billNumber,
      patientName,
      mobileNumber,
      address,
      patientType,
      registrationNumber,
      procedures
    } = req.body;
    const totalAmount = procedures.reduce((sum, p) => sum + (p.cost || 0), 0);
    await client.query("BEGIN");
    const billResult = await client.query(
      `INSERT INTO bills (bill_number, patient_name, mobile_number, address, patient_type, registration_number, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [billNumber, patientName, mobileNumber, address, patientType, registrationNumber, totalAmount]
    );
    const billId = billResult.rows[0].id;
    for (const proc of procedures) {
      if (proc.name) {
        await client.query(
          `INSERT INTO bill_procedures (bill_id, procedure_name, cost)
           VALUES ($1, $2, $3)`,
          [billId, proc.name, proc.cost || 0]
        );
      }
    }
    await client.query("COMMIT");
    res.status(201).json({
      success: true,
      message: "Bill saved successfully",
      data: { id: billId, billNumber }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving bill:", error);
    if (error.code === "23505") {
      res.status(400).json({
        success: false,
        message: "Bill number already exists"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to save bill",
        error: error.message
      });
    }
  } finally {
    client.release();
  }
});
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'bills'
      )
    `);
    if (!tableCheck.rows[0].exists) {
      return res.json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        message: "Database tables not initialized yet"
      });
    }
    let query = `
      SELECT id, bill_number, patient_name, mobile_number, patient_type,
             registration_number, total_amount, created_at
      FROM bills
    `;
    const params = [];
    if (search) {
      query += ` WHERE patient_name ILIKE $1 OR bill_number ILIKE $1 OR registration_number ILIKE $1 OR mobile_number ILIKE $1`;
      params.push(`%${search}%`);
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    let countQuery = "SELECT COUNT(*) FROM bills";
    const countParams = [];
    if (search) {
      countQuery += ` WHERE patient_name ILIKE $1 OR bill_number ILIKE $1 OR registration_number ILIKE $1 OR mobile_number ILIKE $1`;
      countParams.push(`%${search}%`);
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error?.message || String(error) || "Unknown error"
    });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const billResult = await pool.query(
      "SELECT * FROM bills WHERE id = $1",
      [id]
    );
    if (billResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found"
      });
    }
    const proceduresResult = await pool.query(
      "SELECT procedure_name as name, cost FROM bill_procedures WHERE bill_id = $1",
      [id]
    );
    res.json({
      success: true,
      data: {
        ...billResult.rows[0],
        procedures: proceduresResult.rows
      }
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message
    });
  }
});
router.get("/number/:billNumber", async (req, res) => {
  try {
    const { billNumber } = req.params;
    const billResult = await pool.query(
      "SELECT * FROM bills WHERE bill_number = $1",
      [billNumber]
    );
    if (billResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found"
      });
    }
    const proceduresResult = await pool.query(
      "SELECT procedure_name as name, cost FROM bill_procedures WHERE bill_id = $1",
      [billResult.rows[0].id]
    );
    res.json({
      success: true,
      data: {
        ...billResult.rows[0],
        procedures: proceduresResult.rows
      }
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM bills WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found"
      });
    }
    res.json({
      success: true,
      message: "Bill deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete bill",
      error: error.message
    });
  }
});
var bills_default = router;

// server/index.ts
var app = express();
var PORT = process.env.PORT || process.env.API_PORT || 3001;
app.use(cors());
app.use(express.json());
app.use("/api/bills", bills_default);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
console.log("Starting server...");
console.log("PORT:", PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set (hidden)" : "Not set");
var server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initDatabase().then((success) => {
    if (success) {
      console.log("Database ready");
    } else {
      console.log("Database initialization failed - will retry on requests");
    }
  });
});
server.on("error", (err) => {
  console.error("Server error:", err);
});
