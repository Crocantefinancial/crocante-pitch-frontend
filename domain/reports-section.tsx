"use client";

import { Calendar, Download, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [excludeZeroBalances, setExcludeZeroBalances] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const reportOptions = [
    "Balance (amount)",
    "Balance (USD)",
    "Fiat Transfers",
    "FX Transactions",
    "IN 1888",
    "Recon Balance",
  ];

  const reportDownloads = [
    {
      generated: "Aug 25, 00:38",
      initiator: "User01 User03",
      report: "Trades",
      from: "24/08/2023",
      to: "24/08/2023",
      time: "23:59",
      status: "Ready",
    },
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast.error("Please select a report");
      return;
    }

    // Show loading toast
    toast.info("Generating report...");

    // Simulate report generation delay
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Generate Report Section */}
      <div className="bg-card rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Generate Report
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          Select your preferred report from the dropdown menu. If applicable,
          enter the date range to generate the report.
          <br />
          Keep in mind that some reports will have date range selection limits.
        </p>

        <div className="space-y-6">
          {/* Report Selection */}
          <div>
            <label className="block text-sm font-normal text-foreground mb-2">
              Report
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Report</option>
              {reportOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-normal text-foreground mb-2">
                From Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-2 bg-background border border-border rounded text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-normal text-foreground mb-2">
                To Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-4 py-2 bg-background border border-border rounded text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-normal text-foreground mb-2">
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Time</option>
                <option value="00:00">00:00</option>
                <option value="06:00">06:00</option>
                <option value="12:00">12:00</option>
                <option value="18:00">18:00</option>
                <option value="23:59">23:59</option>
              </select>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeZero"
              checked={excludeZeroBalances}
              onChange={(e) => setExcludeZeroBalances(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <label
              htmlFor="excludeZero"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Exclude null and zero asset balances
            </label>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={handleGenerateReport}
              className="px-8 py-2 bg-primary text-primary-foreground rounded font-normal hover:bg-primary/90 transition-colors"
            >
              Generate Report
            </button>
            <p className="text-xs text-muted-foreground">
              All times are in UTC
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Report Downloads
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  Generated
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  Initiator
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  Report
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  From
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  To
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-normal text-muted-foreground">
                  Status
                </th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {reportDownloads.map((report, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/10 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.generated}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.initiator}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.report}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.from}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.to}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.time}
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {report.status}
                  </td>
                  <td className="py-4 px-4">
                    <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded text-sm font-normal hover:bg-primary/90 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-semibold text-foreground text-center mb-4">
              Success!
            </h3>

            <p className="text-sm text-muted-foreground text-center mb-8">
              Your report request has been successfully processed and is
              currently being generated. It will soon be available for download
              in the list below.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-2 bg-primary text-primary-foreground rounded font-normal hover:bg-primary/90 transition-colors"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
