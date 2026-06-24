"use client";
import { useState } from "react";
import { Application, ApplicationStatus } from "@/types";
import { addApplication, deleteApplication, updateStatus } from "@/app/actions/applications";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import AddApplicationModal from "@/components/AddApplicationModal";
import CoverLetterModal from "@/components/CoverLetterModal";

const statusColors: Record<ApplicationStatus, string> = {
  applied: "bg-blue-50 text-blue-700 border border-blue-200",
  interview: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  offer: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const statusOptions: ApplicationStatus[] = ["applied", "interview", "offer", "rejected"];

export default function ApplicationsClient({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [coverLetterApp, setCoverLetterApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");

  const filtered = filterStatus === "all"
    ? applications
    : applications.filter((a) => a.status === filterStatus);

  async function handleAdd(data: Parameters<typeof addApplication>[0]) {
    await addApplication(data);
    // Optimistic: refetch or reload
    window.location.reload();
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    await updateStatus(id, status);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    await deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add application
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", ...statusOptions] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === s
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No applications found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Applied</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {app.company_name}
                      {app.job_url && (
                        <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={12} className="text-gray-400 hover:text-blue-600" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{app.job_title}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none ${statusColors[app.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {format(new Date(app.applied_date), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setCoverLetterApp(app)}
                        className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cover letter
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {coverLetterApp && (
        <CoverLetterModal
          application={coverLetterApp}
          onClose={() => setCoverLetterApp(null)}
        />
      )}
    </div>
  );
}