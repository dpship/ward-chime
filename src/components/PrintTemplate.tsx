import { BillingFormData } from "./BillingForm";
import rmsLogo from "@/assets/rms-logo.png";
import { format } from "date-fns";

interface PrintTemplateProps {
  data: BillingFormData;
  billNumber: string;
}

export const PrintTemplate = ({ data, billNumber }: PrintTemplateProps) => {
  const totalAmount = data.procedures?.reduce((sum, proc) => sum + (proc.cost || 0), 0) || 0;
  const today = format(new Date(), "dd/MM/yyyy");
  const time = format(new Date(), "hh:mm a");

  return (
    <div className="hidden print:block print:p-6 print:max-w-full" style={{ fontSize: "12px" }}>
      <style>
        {`
          @media print {
            @page {
              margin: 0.8cm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>

      {/* Compact Header - Logo left, Hospital info right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "2px solid hsl(217 91% 60%)", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={rmsLogo} alt="RMS Hospitals" style={{ height: "45px" }} />
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "hsl(217 91% 60%)", margin: 0 }}>
              RMS Hospitals
            </h1>
            <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>
              1498/6, Rama Iyer Rd, Krishnamurthy Puram, Mysuru – 570004
            </p>
            <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>
              Ph: 0821-2332381 | info@rmshospitals.in
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "11px", fontWeight: "600", margin: 0 }}>{billNumber}</p>
          <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>{today} | {time}</p>
        </div>
      </div>

      {/* Compact Patient Info - Single row format */}
      <div style={{ backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "4px", marginBottom: "12px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: "11px" }}>
          <span><strong>Patient:</strong> {data.patientName || "—"}</span>
          <span><strong>Mobile:</strong> {data.mobileNumber || "—"}</span>
          <span><strong>{data.patientType}:</strong> {data.registrationNumber}</span>
        </div>
        {data.address && (
          <div style={{ fontSize: "11px", marginTop: "4px" }}>
            <strong>Address:</strong> {data.address}
          </div>
        )}
      </div>

      {/* Procedures Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontSize: "11px", fontWeight: "600", borderBottom: "1px solid #e2e8f0" }}>
              #
            </th>
            <th style={{ textAlign: "left", padding: "6px 8px", fontSize: "11px", fontWeight: "600", borderBottom: "1px solid #e2e8f0" }}>
              Procedure / Service
            </th>
            <th style={{ textAlign: "right", padding: "6px 8px", fontSize: "11px", fontWeight: "600", borderBottom: "1px solid #e2e8f0" }}>
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {data.procedures?.filter(p => p.name).map((proc, idx) => (
            <tr key={idx}>
              <td style={{ padding: "6px 8px", fontSize: "11px", borderBottom: "1px solid #f1f5f9" }}>
                {idx + 1}
              </td>
              <td style={{ padding: "6px 8px", fontSize: "11px", borderBottom: "1px solid #f1f5f9" }}>
                {proc.name}
              </td>
              <td style={{ padding: "6px 8px", fontSize: "11px", textAlign: "right", borderBottom: "1px solid #f1f5f9" }}>
                {proc.cost?.toLocaleString("en-IN") || "0"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: "hsl(217 91% 60%)" }}>
            <td colSpan={2} style={{ padding: "8px", fontSize: "13px", fontWeight: "bold", color: "white" }}>
              Total Amount
            </td>
            <td style={{ padding: "8px", fontSize: "14px", fontWeight: "bold", textAlign: "right", color: "white" }}>
              ₹ {totalAmount.toLocaleString("en-IN")}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "10px", color: "#666", paddingTop: "10px", borderTop: "1px dashed #ccc" }}>
        <p style={{ margin: "0 0 2px 0" }}>Thank you for choosing RMS Hospitals. Wishing you a speedy recovery!</p>
        <p style={{ margin: 0, fontSize: "9px" }}>This is a computer-generated receipt.</p>
      </div>
    </div>
  );
};
