import { useState, useCallback } from "react";
import { BillingForm, BillingFormData } from "@/components/BillingForm";
import { BillPreview } from "@/components/BillPreview";
import { PrintTemplate } from "@/components/PrintTemplate";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState<BillingFormData>({
    patientName: "",
    mobileNumber: "",
    address: "",
    ipdNumber: "",
    opdNumber: "",
    procedures: [{ name: "", cost: 0 }],
  });

  const [billNumber] = useState(() => {
    const timestamp = Date.now().toString().slice(-6);
    return `RMS-BILL-${timestamp}`;
  });

  const handleFormChange = useCallback((data: BillingFormData) => {
    setFormData(data);
  }, []);

  const handleGenerateBill = () => {
    // Validation check
    if (!formData.patientName || !formData.mobileNumber || !formData.address) {
      toast.error("Please fill in all required patient details");
      return;
    }

    if (!formData.procedures.some((p) => p.name && p.cost > 0)) {
      toast.error("Please add at least one procedure with cost");
      return;
    }

    toast.success("Bill generated successfully!", {
      description: `Bill Number: ${billNumber}`,
    });
  };

  const handlePrintBill = () => {
    // Validation check
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
      <div className="min-h-screen bg-gradient-to-br from-medical-blue-light via-background to-secondary">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">
              Patient Billing System
            </h1>
            <p className="text-lg text-muted-foreground">RMS Hospitals - Mysuru</p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Form */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Billing Information</h2>
              </div>
              <BillingForm onFormChange={handleFormChange} />
            </div>

            {/* Right Column - Preview */}
            <div className="lg:sticky lg:top-8 h-fit">
              <BillPreview data={formData} billNumber={billNumber} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleGenerateBill}
              size="lg"
              className="gap-2 px-8 transition-smooth hover:scale-105"
            >
              <FileText className="h-5 w-5" />
              Generate Bill
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
      </div>

      {/* Print Template (Hidden) */}
      <PrintTemplate data={formData} billNumber={billNumber} />
    </>
  );
};

export default Index;
