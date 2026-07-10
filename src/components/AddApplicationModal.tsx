"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addApplication } from "@/app/actions/applications";
import { ApplicationStatus } from "@/types";

export default function ApplicationDetailsModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    status: "Applied" as ApplicationStatus,
    applied_date: "",
    notes: "", // used as job description/requirements
    job_url: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.company_name || !form.job_title || !form.applied_date || !form.notes) return;
    setLoading(true);
    try {
      await addApplication(form);
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-700 hover:text-gray-900 text-xl leading-none"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
          Application Details Tab
        </h2>

        {/* Hiring Entity name */}
        <div className="mb-4">
          <label className="block text-base font-semibold text-gray-900 mb-1">
            Hiring Entity name <span className="text-red-600">*</span>
          </label>
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Google Corporation"
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Job Title name */}
        <div className="mb-4">
          <label className="block text-base font-semibold text-gray-900 mb-1">
            Job Title name <span className="text-red-600">*</span>
          </label>
          <input
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            placeholder="Quality Assurance Officer"
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Status + Date Applied */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-1">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-1">
              Date Applied <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="applied_date"
              value={form.applied_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Job Description / Requirements */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-1">
            Job Description | Requirements <span className="text-red-600">*</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder={`Requirements:\n• Bachelor's Degree in Computer Science, Information Technology or equivalent\nExperience in:\n  • Laravel framework\n  • HTML, CSS, JavaScript, PHP, and API integration`}
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded font-medium transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}