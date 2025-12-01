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

  return (
    <div className="hidden print:block print:p-8 print:max-w-full">
      <style>
        {`
          @media print {
            @page {
              margin: 1cm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>

      {/* Hospital Header */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: "3px solid hsl(217 91% 60%)" }}>
        <img src={rmsLogo} alt="RMS Hospitals Logo" style={{ height: "80px", margin: "0 auto 16px" }} />
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "hsl(217 91% 60%)", marginBottom: "8px" }}>
          RMS Hospitals
        </h1>
        <div style={{ fontSize: "12px", color: "#666" }}>
          <p>1498/6, Rama Iyer Rd, Krishnamurthy Puram, Mysuru – 570004</p>
          <p style={{ marginTop: "4px" }}>Phone: 0821-2332381 | Email: info@rmshospitals.in</p>
        </div>
      </div>

      {/* Bill Details */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#666" }}>Bill Number</p>
          <p style={{ fontSize: "16px", fontWeight: "600" }}>{billNumber}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "12px", color: "#666" }}>Date</p>
          <p style={{ fontSize: "16px", fontWeight: "600" }}>{today}</p>
        </div>
      </div>

      {/* Patient Information */}
      <div style={{ marginBottom: "24px", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
        <h3 style={{ fontWeight: "600", color: "hsl(217 91% 60%)", marginBottom: "12px" }}>
          Patient Information
        </h3>
        <table style={{ width: "100%", fontSize: "13px" }}>
          <tbody>
            <tr>
              <td style={{ paddingBottom: "8px", color: "#666" }}>Name:</td>
              <td style={{ paddingBottom: "8px", fontWeight: "500" }}>{data.patientName || "—"}</td>
              <td style={{ paddingBottom: "8px", color: "#666" }}>Mobile:</td>
              <td style={{ paddingBottom: "8px", fontWeight: "500" }}>{data.mobileNumber || "—"}</td>
            </tr>
            {(data.ipdNumber || data.opdNumber) && (
              <tr>
                {data.ipdNumber && (
                  <>
                    <td style={{ paddingBottom: "8px", color: "#666" }}>IPD No:</td>
                    <td style={{ paddingBottom: "8px", fontWeight: "500" }}>{data.ipdNumber}</td>
                  </>
                )}
                {data.opdNumber && (
                  <>
                    <td style={{ paddingBottom: "8px", color: "#666" }}>OPD No:</td>
                    <td style={{ paddingBottom: "8px", fontWeight: "500" }}>{data.opdNumber}</td>
                  </>
                )}
              </tr>
            )}
            <tr>
              <td style={{ color: "#666", verticalAlign: "top" }}>Address:</td>
              <td colSpan={3} style={{ fontWeight: "500" }}>{data.address || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Treatment Details */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontWeight: "600", color: "hsl(217 91% 60%)", marginBottom: "12px" }}>
          Treatment Details
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontSize: "13px", color: "#666" }}>
                Procedure
              </th>
              <th style={{ textAlign: "right", padding: "8px 0", fontSize: "13px", color: "#666" }}>
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {data.procedures?.map((proc, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px 0", fontSize: "13px" }}>{proc.name || "—"}</td>
                <td style={{ padding: "12px 0", fontSize: "13px", textAlign: "right", fontWeight: "500" }}>
                  ₹ {proc.cost?.toLocaleString("en-IN") || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div style={{ borderTop: "3px solid hsl(217 91% 60%)", paddingTop: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>Total Amount</span>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "hsl(217 91% 60%)" }}>
            ₹ {totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "13px", color: "#666", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ fontWeight: "500" }}>Thank you for choosing RMS Hospitals</p>
        <p style={{ fontSize: "11px", marginTop: "4px" }}>Wishing you a speedy recovery!</p>
      </div>
    </div>
  );
};
