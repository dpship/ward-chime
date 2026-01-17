import { BillingFormData } from "./BillingForm";
import rmsLogo from "@/assets/rms-logo.png";
import { format } from "date-fns";

interface BillPreviewProps {
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

export const BillPreview = ({ data, billNumber }: BillPreviewProps) => {
  const totalAmount = data.procedures?.reduce((sum, proc) => sum + (proc.cost || 0), 0) || 0;
  const today = format(new Date(), "dd MMMM yyyy");
  const time = format(new Date(), "hh:mm a");

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Hospital Header */}
      <div className="p-6 pb-4 border-b-[3px] border-[#1e3a5f]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img src={rmsLogo} alt="RMS Hospitals Logo" className="h-16" />
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f] tracking-tight">RMS HOSPITALS</h1>
              <p className="text-xs text-slate-500 font-medium">Multispeciality Healthcare & Diagnostic Centre</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-[#1e3a5f]">1498/6, Rama Iyer Road</p>
            <p>Krishnamurthy Puram, Mysuru – 570004</p>
            <p className="mt-1"><span className="font-semibold">Tel:</span> 0821-2332381</p>
            <p><span className="font-semibold">Email:</span> info@rmshospitals.in</p>
          </div>
        </div>
      </div>

      {/* Bill Title Bar */}
      <div className="bg-[#1e3a5f] text-white text-center py-2">
        <h2 className="text-sm font-semibold tracking-[3px] uppercase">
          {data.patientType === "IPD" ? "INPATIENT BILL" : "OUTPATIENT BILL"}
        </h2>
      </div>

      {/* Bill Details Row */}
      <div className="mx-6 mt-4 p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-start">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Bill Number</p>
            <p className="text-sm font-bold text-[#1e3a5f] font-mono">{billNumber}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{data.patientType} Number</p>
            <p className="text-sm font-bold text-[#1e3a5f] font-mono">{data.registrationNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Date & Time</p>
          <p className="text-sm font-semibold text-[#1e3a5f]">{today}</p>
          <p className="text-xs text-slate-400">{time}</p>
        </div>
      </div>

      {/* Patient Information */}
      <div className="mx-6 mt-4">
        <div className="bg-[#1e3a5f] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
          Patient Information
        </div>
        <div className="border border-t-0 border-slate-300 p-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex">
              <span className="w-24 text-slate-400 text-xs">Patient Name</span>
              <span className="font-semibold">: {data.patientName || "—"}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-slate-400 text-xs">Mobile No.</span>
              <span className="font-semibold">: {data.mobileNumber || "—"}</span>
            </div>
            <div className="flex col-span-2">
              <span className="w-24 text-slate-400 text-xs">Address</span>
              <span className="font-medium">: {data.address || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="mx-6 mt-4">
        <div className="bg-[#1e3a5f] text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
          Services / Procedures
        </div>
        <table className="w-full border border-t-0 border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="w-12 text-center py-2 px-3 text-xs font-semibold text-slate-600 border-b-2 border-slate-300 border-r border-slate-200">S.No.</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-600 border-b-2 border-slate-300 border-r border-slate-200">Description of Service</th>
              <th className="w-28 text-right py-2 px-3 text-xs font-semibold text-slate-600 border-b-2 border-slate-300">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {data.procedures?.filter(p => p.name).map((proc, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="text-center py-2.5 px-3 text-sm text-slate-400 border-b border-slate-200 border-r">{idx + 1}</td>
                <td className="py-2.5 px-3 text-sm border-b border-slate-200 border-r">{proc.name}</td>
                <td className="py-2.5 px-3 text-sm text-right font-mono font-medium border-b border-slate-200">
                  {proc.cost?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
                </td>
              </tr>
            ))}
            {(!data.procedures || data.procedures.filter(p => p.name).length === 0) && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-slate-400 text-sm">No procedures added</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-[#1e3a5f] text-white">
              <td colSpan={2} className="py-3 px-4 text-sm font-bold text-right tracking-wide">GRAND TOTAL</td>
              <td className="py-3 px-4 text-base font-bold text-right font-mono">
                ₹ {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in Words */}
      <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-300 rounded">
        <p className="text-xs">
          <span className="text-slate-400 font-medium">Amount in Words: </span>
          <span className="font-semibold text-green-700 italic">{numberToWords(Math.round(totalAmount))}</span>
        </p>
      </div>

      {/* Payment & Authorization Section */}
      <div className="mx-6 mt-4 flex justify-between items-end gap-6">
        <div className="flex-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Payment Mode</p>
          <div className="border border-slate-300 rounded px-3 py-2 text-sm">
            Cash / Card / UPI / Online
          </div>
        </div>
        <div className="w-44 text-center">
          <div className="border-b border-[#1e3a5f] mb-1 pt-8"></div>
          <p className="text-xs font-semibold text-[#1e3a5f]">Authorized Signatory</p>
          <p className="text-[10px] text-slate-400">RMS Hospitals</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mx-6 mt-4 p-3 bg-slate-50 border border-slate-200 rounded">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">Terms & Conditions</p>
        <ul className="text-[10px] text-slate-400 leading-relaxed list-disc list-inside space-y-0.5">
          <li>This bill is valid for 30 days from the date of issue.</li>
          <li>Payment once made is non-refundable except in case of duplicate billing.</li>
          <li>Please retain this bill for future reference and insurance claims.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mx-6 mt-4 mb-6 pt-3 border-t-2 border-[#1e3a5f] text-center">
        <p className="text-sm font-semibold text-[#1e3a5f]">Thank you for choosing RMS Hospitals</p>
        <p className="text-xs text-slate-400 mt-1">Your Health, Our Commitment — Wishing you a speedy recovery!</p>
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-slate-300">
          <span>www.rmshospitals.in</span>
          <span>•</span>
          <span>Computer-generated bill</span>
        </div>
      </div>
    </div>
  );
};
