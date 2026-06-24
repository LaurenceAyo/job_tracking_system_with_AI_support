"use client";
import { useState } from "react";
import { ApplicationStatus } from "@/types";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  onAdd: (data: {
    company_name: string;
    job_title: string;
    job_url: string;
    status: ApplicationStatus;
    applied_date: string;
    notes: string;
  }) => Promise<void>;
};

export default function AddApplicationModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "applied" as ApplicationStatus,
    applied_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.company_name || !form.job_title) return;
    setLoading(true);
    await onAdd(form);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">New application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Company name *", field: "company_name", placeholder: "Google" },
            { label: "Job title *", field: "job_title", placeholder: "Frontend Developer" },
            { label: "Job URL", field: "job_url", placeholder: "https://careers.google.com/..." },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={(form as Record<string, string>)[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date applied</label>
              <input
                type="date"
                value={form.applied_date}
                onChange={(e) => update("applied_date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Any additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.company_name || !form.job_title}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}