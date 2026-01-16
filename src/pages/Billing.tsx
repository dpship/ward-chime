import { useState, useCallback } from "react";
import { BillingForm, BillingFormData } from "@/components/BillingForm";
import { BillPreview } from "@/components/BillPreview";
import { PrintTemplate } from "@/components/PrintTemplate";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveBill } from "@/services/api";

export default function Billing() {
  const [formData, setFormData] = useState<BillingFormData>({
    patientName: "",
    mobileNumber: "",
    address: "",
    patientType: "OPD",
    registrationNumber: "",
    procedures: [{ name: "", cost: 0 }],
  });

  const [billNumber] = useState(() => {
    const timestamp = Date.now().toString().slice(-6);
    return `RMS-BILL-${timestamp}`;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFormChange = useCallback((data: BillingFormData) => {
    setFormData(data);
    setIsSaved(false); // Reset saved state when form changes
  }, []);

  const handleGenerateBill = async () => {
    if (!formData.patientName || !formData.mobileNumber || !formData.address) {
      toast.error("Please fill in all required patient details");
      return;
    }

    if (!formData.procedures.some((p) => p.name && p.cost > 0)) {
      toast.error("Please add at least one procedure with cost");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveBill({
        billNumber,
        patientName: formData.patientName,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        patientType: formData.patientType,
        registrationNumber: formData.registrationNumber,
        procedures: formData.procedures,
      });

      if (result.success) {
        setIsSaved(true);
        toast.success("Bill saved successfully!", {
          description: `Bill Number: ${billNumber}`,
        });
      } else {
        toast.error(result.message || "Failed to save bill");
      }
    } catch (error) {
      console.error("Error saving bill:", error);
      toast.error("Failed to connect to server. Make sure the backend is running.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintBill = () => {
    if (!formData.patientName || !formData.mobileNumber || !formData.address) {
      toast.error("Please fill in all required patient details before printing");
      return;
    }

    if (!formData.procedures.some((p) => p.name && p.cost > 0)) {
      toast.error("Please add at least one procedure with cost before printing");
      return;
    }

    window.print();
  };

  return (
    <>
      <div className="flex-1 p-6 print:hidden">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Patient Billing</h2>
          <p className="text-muted-foreground">
            Create and manage patient bills
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Billing Information</h3>
            </div>
            <BillingForm onFormChange={handleFormChange} />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <BillPreview data={formData} billNumber={billNumber} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleGenerateBill}
            size="lg"
            className="gap-2 px-8 transition-smooth hover:scale-105"
            disabled={isSaving || isSaved}
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {isSaving ? "Saving..." : isSaved ? "Bill Saved" : "Generate & Save Bill"}
          </Button>
          <Button
            onClick={handlePrintBill}
            size="lg"
            variant="outline"
            className="gap-2 px-8 transition-smooth hover:scale-105"
          >
            <Printer className="h-5 w-5" />
            Print Bill
          </Button>
        </div>
      </div>

      {/* Print Template (Hidden) */}
      <PrintTemplate data={formData} billNumber={billNumber} />
    </>
  );
}
