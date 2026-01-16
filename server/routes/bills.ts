import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

interface Procedure {
  name: string;
  cost: number;
}

interface BillData {
  billNumber: string;
  patientName: string;
  mobileNumber: string;
  address: string;
  patientType: "IPD" | "OPD";
  registrationNumber: string;
  procedures: Procedure[];
}

// Create a new bill
router.post("/", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      billNumber,
      patientName,
      mobileNumber,
      address,
      patientType,
      registrationNumber,
      procedures,
    }: BillData = req.body;

    // Calculate total
    const totalAmount = procedures.reduce((sum, p) => sum + (p.cost || 0), 0);

    await client.query("BEGIN");

    // Insert bill
    const billResult = await client.query(
      `INSERT INTO bills (bill_number, patient_name, mobile_number, address, patient_type, registration_number, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [billNumber, patientName, mobileNumber, address, patientType, registrationNumber, totalAmount]
    );

    const billId = billResult.rows[0].id;

    // Insert procedures
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
      data: { id: billId, billNumber },
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error saving bill:", error);

    if (error.code === "23505") {
      res.status(400).json({
        success: false,
        message: "Bill number already exists",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to save bill",
        error: error.message,
      });
    }
  } finally {
    client.release();
  }
});

// Get all bills (paginated)
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;

    // First check if table exists
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
    const params: any[] = [];

    if (search) {
      query += ` WHERE patient_name ILIKE $1 OR bill_number ILIKE $1 OR registration_number ILIKE $1 OR mobile_number ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM bills";
    const countParams: any[] = [];
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
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bills",
      error: error?.message || String(error) || "Unknown error",
    });
  }
});

// Get single bill with procedures
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const billResult = await pool.query(
      "SELECT * FROM bills WHERE id = $1",
      [id]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
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
        procedures: proceduresResult.rows,
      },
    });
  } catch (error: any) {
    console.error("Error fetching bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message,
    });
  }
});

// Get bill by bill number
router.get("/number/:billNumber", async (req: Request, res: Response) => {
  try {
    const { billNumber } = req.params;

    const billResult = await pool.query(
      "SELECT * FROM bills WHERE bill_number = $1",
      [billNumber]
    );

    if (billResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
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
        procedures: proceduresResult.rows,
      },
    });
  } catch (error: any) {
    console.error("Error fetching bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bill",
      error: error.message,
    });
  }
});

// Delete bill
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM bills WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete bill",
      error: error.message,
    });
  }
});

export default router;
