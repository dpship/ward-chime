import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const billingSchema = z.object({
  patientName: z.string().min(2, "Patient name is required").max(100),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
  address: z.string().min(5, "Address is required").max(200),
  ipdNumber: z.string().optional(),
  opdNumber: z.string().optional(),
  procedures: z.array(
    z.object({
      name: z.string().min(2, "Procedure name is required"),
      cost: z.number().min(0, "Cost must be positive"),
    })
  ).min(1, "At least one procedure is required"),
});

export type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onFormChange: (data: BillingFormData) => void;
}

export const BillingForm = ({ onFormChange }: BillingFormProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      procedures: [{ name: "", cost: 0 }],
    },
  });

  const procedures = watch("procedures") || [];
  const formData = watch();

  // Update parent component whenever form changes
  React.useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  const addProcedure = () => {
    setValue("procedures", [...procedures, { name: "", cost: 0 }]);
  };

  const removeProcedure = (index: number) => {
    if (procedures.length > 1) {
      setValue(
        "procedures",
        procedures.filter((_, i) => i !== index)
      );
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
            <Label htmlFor="ipdNumber">IPD Number</Label>
            <Input
              id="ipdNumber"
              {...register("ipdNumber")}
              placeholder="Enter IPD number"
              className="transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opdNumber">OPD Number</Label>
            <Input
              id="opdNumber"
              {...register("opdNumber")}
              placeholder="Enter OPD number"
              className="transition-smooth"
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
          {procedures.map((_, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`procedures.${index}.name`}>Procedure Name *</Label>
                <Input
                  id={`procedures.${index}.name`}
                  {...register(`procedures.${index}.name`)}
                  placeholder="e.g., Blood Test, X-Ray"
                  className="transition-smooth"
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

              {procedures.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeProcedure(index)}
                  size="icon"
                  variant="ghost"
                  className="mt-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from "react";
