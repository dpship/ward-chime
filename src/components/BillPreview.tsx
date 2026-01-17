import { BillingFormData } from "./BillingForm";
import rmsLogo from "@/assets/rms-logo.png";
import { format } from "date-fns";

interface BillPreviewProps {
  data: BillingFormData;
  billNumber: string;
}

export const BillPreview = ({ data, billNumber }: BillPreviewProps) => {
  const totalAmount = data.procedures?.reduce((sum, proc) => sum + (proc.cost || 0), 0) || 0;
  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg transition-smooth">
      {/* Hospital Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-primary">
        <img src={rmsLogo} alt="RMS Hospitals Logo" className="h-24 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">RMS Hospitals</h1>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1498/6, Rama Iyer Rd, Krishnamurthy Puram</p>
          <p>Mysuru – 570004</p>
          <p className="flex items-center justify-center gap-4 mt-2">
            <span>📞 0821-2332381</span>
            <span>✉️ info@rmshospitals.in</span>
          </p>
        </div>
      </div>

      {/* Bill Details */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Bill Number</p>
          <p className="text-lg font-semibold text-foreground">{billNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="text-lg font-semibold text-foreground">{today}</p>
        </div>
      </div>

      {/* Patient Information */}
      <div className="mb-6 bg-secondary/50 rounded-lg p-4">
        <h3 className="font-semibold text-primary mb-3">Patient Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <span className="ml-2 font-medium">{data.patientName || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Mobile:</span>
            <span className="ml-2 font-medium">{data.mobileNumber || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{data.patientType} No:</span>
            <span className="ml-2 font-medium font-mono">{data.registrationNumber || "—"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Address:</span>
            <span className="ml-2 font-medium">{data.address || "—"}</span>
          </div>
        </div>
      </div>

      {/* Treatment Details */}
      <div className="mb-6">
        <h3 className="font-semibold text-primary mb-3">Treatment Details</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                Procedure
              </th>
              <th className="text-right py-2 text-sm font-semibold text-muted-foreground">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {data.procedures?.map((proc, idx) => (
              <tr key={idx} className="border-b border-border/50">
                <td className="py-3 text-sm">{proc.name || "—"}</td>
                <td className="py-3 text-sm text-right font-medium">
                  ₹ {proc.cost?.toLocaleString("en-IN") || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="border-t-2 border-primary pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-primary">
            ₹ {totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
        <p className="font-medium">Thank you for choosing RMS Hospitals</p>
        <p className="text-xs mt-1">Wishing you a speedy recovery!</p>
      </div>
    </div>
  );
};
