import { BillingFormData } from "./BillingForm";
import rmsLogo from "@/assets/rms-logo.png";
import { format } from "date-fns";

interface PrintTemplateProps {
  data: BillingFormData;
  billNumber: string;
}

// Convert number to words for Indian currency
const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  let result = '';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  if (crore) result += convertLessThanThousand(crore) + ' Crore ';
  if (lakh) result += convertLessThanThousand(lakh) + ' Lakh ';
  if (thousand) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remainder) result += convertLessThanThousand(remainder);

  return result.trim() + ' Rupees Only';
};

export const PrintTemplate = ({ data, billNumber }: PrintTemplateProps) => {
  const totalAmount = data.procedures?.reduce((sum, proc) => sum + (proc.cost || 0), 0) || 0;
  const today = format(new Date(), "dd MMMM yyyy");
  const time = format(new Date(), "hh:mm a");

  return (
    <div className="hidden print:block" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "11pt",
      color: "#1a1a1a",
      lineHeight: 1.4,
      padding: "0",
      width: "210mm",
      minHeight: "297mm",
      margin: "0 auto",
      backgroundColor: "white"
    }}>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 10mm 12mm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 0;
            }
            * {
              box-sizing: border-box;
            }
          }
        `}
      </style>

      {/* Header with Logo and Hospital Info */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingBottom: "12px",
        borderBottom: "3px solid #1e3a5f",
        marginBottom: "0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={rmsLogo} alt="RMS Hospitals" style={{ height: "70px", width: "auto" }} />
          <div>
            <h1 style={{
              fontSize: "28pt",
              fontWeight: "700",
              color: "#1e3a5f",
              margin: "0 0 2px 0",
              letterSpacing: "-0.5px"
            }}>
              RMS HOSPITALS
            </h1>
            <p style={{ fontSize: "9pt", color: "#4a5568", margin: "0", fontWeight: "500" }}>
              Multispeciality Healthcare & Diagnostic Centre
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "8.5pt", color: "#4a5568", lineHeight: 1.5 }}>
          <p style={{ margin: "0", fontWeight: "600", color: "#1e3a5f" }}>1498/6, Rama Iyer Road</p>
          <p style={{ margin: "0" }}>Krishnamurthy Puram, Mysuru – 570004</p>
          <p style={{ margin: "4px 0 0 0" }}>
            <span style={{ fontWeight: "600" }}>Tel:</span> 0821-2332381
          </p>
          <p style={{ margin: "0" }}>
            <span style={{ fontWeight: "600" }}>Email:</span> info@rmshospitals.in
          </p>
        </div>
      </div>

      {/* Bill Title Bar */}
      <div style={{
        backgroundColor: "#1e3a5f",
        color: "white",
        textAlign: "center",
        padding: "8px 0",
        marginBottom: "16px"
      }}>
        <h2 style={{ margin: 0, fontSize: "14pt", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase" }}>
          {data.patientType === "IPD" ? "INPATIENT BILL" : "OUTPATIENT BILL"}
        </h2>
      </div>

      {/* Bill Details Row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        padding: "12px 16px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "4px"
      }}>
        <div style={{ display: "flex", gap: "40px" }}>
          <div>
            <p style={{ margin: "0", fontSize: "8pt", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bill Number</p>
            <p style={{ margin: "2px 0 0 0", fontSize: "12pt", fontWeight: "700", color: "#1e3a5f", fontFamily: "monospace" }}>{billNumber}</p>
          </div>
          <div>
            <p style={{ margin: "0", fontSize: "8pt", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{data.patientType} Number</p>
            <p style={{ margin: "2px 0 0 0", fontSize: "12pt", fontWeight: "700", color: "#1e3a5f", fontFamily: "monospace" }}>{data.registrationNumber}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0", fontSize: "8pt", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date & Time</p>
          <p style={{ margin: "2px 0 0 0", fontSize: "11pt", fontWeight: "600", color: "#1e3a5f" }}>{today}</p>
          <p style={{ margin: "0", fontSize: "9pt", color: "#64748b" }}>{time}</p>
        </div>
      </div>

      {/* Patient Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          backgroundColor: "#1e3a5f",
          color: "white",
          padding: "6px 12px",
          fontSize: "9pt",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "1px"
        }}>
          Patient Information
        </div>
        <div style={{
          border: "1px solid #d1d5db",
          borderTop: "none",
          padding: "12px 16px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
            <div style={{ display: "flex" }}>
              <span style={{ width: "100px", color: "#64748b", fontSize: "9pt" }}>Patient Name</span>
              <span style={{ fontWeight: "600", fontSize: "10pt" }}>: {data.patientName || "—"}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ width: "100px", color: "#64748b", fontSize: "9pt" }}>Mobile No.</span>
              <span style={{ fontWeight: "600", fontSize: "10pt" }}>: {data.mobileNumber || "—"}</span>
            </div>
            <div style={{ display: "flex", gridColumn: "1 / -1" }}>
              <span style={{ width: "100px", color: "#64748b", fontSize: "9pt" }}>Address</span>
              <span style={{ fontWeight: "500", fontSize: "10pt" }}>: {data.address || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          backgroundColor: "#1e3a5f",
          color: "white",
          padding: "6px 12px",
          fontSize: "9pt",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "0"
        }}>
          Services / Procedures
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d1d5db", borderTop: "none" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{
                width: "50px",
                textAlign: "center",
                padding: "10px 12px",
                fontSize: "9pt",
                fontWeight: "600",
                color: "#374151",
                borderBottom: "2px solid #d1d5db",
                borderRight: "1px solid #e5e7eb"
              }}>
                S.No.
              </th>
              <th style={{
                textAlign: "left",
                padding: "10px 12px",
                fontSize: "9pt",
                fontWeight: "600",
                color: "#374151",
                borderBottom: "2px solid #d1d5db",
                borderRight: "1px solid #e5e7eb"
              }}>
                Description of Service
              </th>
              <th style={{
                width: "120px",
                textAlign: "right",
                padding: "10px 12px",
                fontSize: "9pt",
                fontWeight: "600",
                color: "#374151",
                borderBottom: "2px solid #d1d5db"
              }}>
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.procedures?.filter(p => p.name).map((proc, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#fafbfc" }}>
                <td style={{
                  textAlign: "center",
                  padding: "10px 12px",
                  fontSize: "10pt",
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb",
                  color: "#64748b"
                }}>
                  {idx + 1}
                </td>
                <td style={{
                  padding: "10px 12px",
                  fontSize: "10pt",
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb"
                }}>
                  {proc.name}
                </td>
                <td style={{
                  padding: "10px 12px",
                  fontSize: "10pt",
                  textAlign: "right",
                  borderBottom: "1px solid #e5e7eb",
                  fontFamily: "monospace",
                  fontWeight: "500"
                }}>
                  {proc.cost?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
                </td>
              </tr>
            ))}
            {/* Empty rows for consistent look */}
            {Array.from({ length: Math.max(0, 5 - (data.procedures?.filter(p => p.name).length || 0)) }).map((_, idx) => (
              <tr key={`empty-${idx}`} style={{ backgroundColor: ((data.procedures?.filter(p => p.name).length || 0) + idx) % 2 === 0 ? "white" : "#fafbfc" }}>
                <td style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb"
                }}>&nbsp;</td>
                <td style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb"
                }}>&nbsp;</td>
                <td style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #e5e7eb"
                }}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#1e3a5f" }}>
              <td colSpan={2} style={{
                padding: "12px 16px",
                fontSize: "11pt",
                fontWeight: "700",
                color: "white",
                textAlign: "right",
                letterSpacing: "0.5px"
              }}>
                GRAND TOTAL
              </td>
              <td style={{
                padding: "12px 16px",
                fontSize: "13pt",
                fontWeight: "700",
                textAlign: "right",
                color: "white",
                fontFamily: "monospace"
              }}>
                ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in Words */}
      <div style={{
        backgroundColor: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "4px",
        padding: "10px 16px",
        marginBottom: "20px"
      }}>
        <p style={{ margin: 0, fontSize: "9pt" }}>
          <span style={{ color: "#64748b", fontWeight: "500" }}>Amount in Words: </span>
          <span style={{ fontWeight: "600", color: "#166534", fontStyle: "italic" }}>{numberToWords(Math.round(totalAmount))}</span>
        </p>
      </div>

      {/* Payment & Authorization Section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "8pt", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>Payment Mode</p>
          <div style={{ border: "1px solid #d1d5db", borderRadius: "4px", padding: "8px 12px", minHeight: "32px" }}>
            <span style={{ fontSize: "10pt" }}>Cash / Card / UPI / Online</span>
          </div>
        </div>
        <div style={{ width: "200px", textAlign: "center" }}>
          <div style={{ borderBottom: "1px solid #1e3a5f", marginBottom: "6px", paddingTop: "40px" }}></div>
          <p style={{ margin: 0, fontSize: "9pt", fontWeight: "600", color: "#1e3a5f" }}>Authorized Signatory</p>
          <p style={{ margin: "2px 0 0 0", fontSize: "8pt", color: "#64748b" }}>RMS Hospitals</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        padding: "12px 16px",
        marginBottom: "16px"
      }}>
        <p style={{ margin: "0 0 6px 0", fontSize: "8pt", fontWeight: "600", color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>Terms & Conditions</p>
        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "7.5pt", color: "#64748b", lineHeight: 1.6 }}>
          <li>This bill is valid for 30 days from the date of issue.</li>
          <li>Payment once made is non-refundable except in case of duplicate billing.</li>
          <li>Please retain this bill for future reference and insurance claims.</li>
          <li>For any billing queries, please contact our billing department.</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "2px solid #1e3a5f",
        paddingTop: "12px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0 0 4px 0", fontSize: "10pt", fontWeight: "600", color: "#1e3a5f" }}>
          Thank you for choosing RMS Hospitals
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "8pt", color: "#64748b" }}>
          Your Health, Our Commitment — Wishing you a speedy recovery!
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", fontSize: "7.5pt", color: "#94a3b8" }}>
          <span>www.rmshospitals.in</span>
          <span>•</span>
          <span>This is a computer-generated bill</span>
          <span>•</span>
          <span>Printed on {format(new Date(), "dd/MM/yyyy 'at' hh:mm a")}</span>
        </div>
      </div>
    </div>
  );
};
