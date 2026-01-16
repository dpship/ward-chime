const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface Procedure {
  name: string;
  cost: number;
}

export interface BillData {
  billNumber: string;
  patientName: string;
  mobileNumber: string;
  address: string;
  patientType: "IPD" | "OPD";
  registrationNumber: string;
  procedures: Procedure[];
}

export interface Bill {
  id: number;
  bill_number: string;
  patient_name: string;
  mobile_number: string;
  address: string;
  patient_type: "IPD" | "OPD";
  registration_number: string;
  total_amount: number;
  created_at: string;
  procedures?: Procedure[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Save a new bill
export async function saveBill(bill: BillData): Promise<ApiResponse<{ id: number; billNumber: string }>> {
  const response = await fetch(`${API_URL}/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  });

  return response.json();
}

// Get all bills (paginated)
export async function getBills(
  page = 1,
  limit = 20,
  search?: string
): Promise<PaginatedResponse<Bill>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`${API_URL}/bills?${params}`);
  return response.json();
}

// Get single bill by ID
export async function getBillById(id: number): Promise<ApiResponse<Bill>> {
  const response = await fetch(`${API_URL}/bills/${id}`);
  return response.json();
}

// Get bill by bill number
export async function getBillByNumber(billNumber: string): Promise<ApiResponse<Bill>> {
  const response = await fetch(`${API_URL}/bills/number/${encodeURIComponent(billNumber)}`);
  return response.json();
}

// Delete bill
export async function deleteBill(id: number): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_URL}/bills/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

// Health check
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
