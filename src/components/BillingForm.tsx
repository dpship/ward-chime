import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ServiceCombobox } from "@/components/ServiceCombobox";
import { Service } from "@/data/services";

const billingSchema = z.object({
  patientName: z.string().min(2, "Patient name is required").max(100),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
  address: z.string().min(5, "Address is required").max(200),
  patientType: z.enum(["IPD", "OPD"]),
  registrationNumber: z.string(),
  procedures: z.array(
    z.object({
      name: z.string().min(2, "Procedure name is required"),
      cost: z.number().min(0, "Cost must be positive"),
    })
  ).min(1, "At least one procedure is required"),
});

const generateRegistrationNumber = (type: "IPD" | "OPD") => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${type}-${year}${month}${day}-${random}`;
};

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onFormChange: (data: BillingFormData) => void;
}

export const BillingForm = ({ onFormChange }: BillingFormProps) => {
  const [initialRegNumber] = React.useState(() => generateRegistrationNumber("OPD"));

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      patientType: "OPD",
      registrationNumber: initialRegNumber,
      procedures: [{ name: "", cost: 0 }],
    },
  });

  const procedures = watch("procedures") || [];
  const patientType = watch("patientType");
  const registrationNumber = watch("registrationNumber");
  const formData = watch();

  const handlePatientTypeChange = (type: "IPD" | "OPD") => {
    setValue("patientType", type);
    setValue("registrationNumber", generateRegistrationNumber(type));
  };

  // Update parent component whenever form changes
  React.useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const addProcedure = () => {
    setValue("procedures", [...procedures, { name: "", cost: 0 }], { shouldValidate: true, shouldDirty: true });
  };

  const removeProcedure = (index: number) => {
    if (procedures.length > 1) {
      const newProcedures = procedures.filter((_, i) => i !== index);
      setValue("procedures", newProcedures, { shouldValidate: true, shouldDirty: true });
    } else {
      // If only 1 procedure, clear it instead of removing
      setValue(`procedures.${index}.name`, "");
      setValue(`procedures.${index}.cost`, 0);
    }
  };

  const handleServiceSelect = (index: number, service: Service | null) => {
    if (service) {
      setValue(`procedures.${index}.name`, service.name);
      setValue(`procedures.${index}.cost`, service.cost);
    } else {
      setValue(`procedures.${index}.name`, "");
      setValue(`procedures.${index}.cost`, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Patient Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              {...register("patientName")}
              placeholder="Enter patient name"
              className="transition-smooth"
            />
            {errors.patientName && (
              <p className="text-sm text-destructive">{errors.patientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              {...register("mobileNumber")}
              placeholder="10-digit mobile number"
              maxLength={10}
              className="transition-smooth"
            />
            {errors.mobileNumber && (
              <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            {...register("address")}
            placeholder="Enter patient address"
            className="transition-smooth resize-none"
            rows={3}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* Hospital Registration Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Hospital Registration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Patient Type *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={patientType === "OPD" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handlePatientTypeChange("OPD")}
              >
                OPD
              </Button>
              <Button
                type="button"
                variant={patientType === "IPD" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handlePatientTypeChange("IPD")}
              >
                IPD
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input
              value={registrationNumber}
              readOnly
              className="transition-smooth bg-muted font-mono"
            />
          </div>
        </div>
      </div>

      {/* Procedures & Billing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Procedures & Billing</h3>
          <Button
            type="button"
            onClick={addProcedure}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Procedure
          </Button>
        </div>

        <div className="space-y-3">
          {procedures.map((procedure, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <Label>Procedure / Service *</Label>
                <ServiceCombobox
                  value={procedure.name}
                  onSelect={(service) => handleServiceSelect(index, service)}
                  placeholder="Search procedure or service..."
                />
              </div>

              <div className="w-32 space-y-2">
                <Label htmlFor={`procedures.${index}.cost`}>Cost (₹) *</Label>
                <Input
                  id={`procedures.${index}.cost`}
                  type="number"
                  {...register(`procedures.${index}.cost`, { valueAsNumber: true })}
                  placeholder="0"
                  className="transition-smooth"
                />
              </div>

              <Button
                type="button"
                onClick={() => removeProcedure(index)}
                size="icon"
                variant="ghost"
                className="mt-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
