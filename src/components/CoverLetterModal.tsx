"use client";
import { useState, useEffect } from "react";
import { Application } from "@/types";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  application: Application;
  onClose: () => void;
};

export default function CoverLetterModal({ application, onClose }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ content: string; created_at: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Load previous cover letters for this application
    supabase
      .from("cover_letters")
      .select("content, created_at")
      .eq("application_id", application.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHistory(data);
          setContent(data[0].content);
        }
      });
  }, [application.id]);

  async function generate() {
    setLoading(true);
    setContent("");
    const res = await fetch("/api/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: application.id,
        company_name: application.company_name,
        job_title: application.job_title,
        notes: application.notes,
      }),
    });
    const data = await res.json();
    setContent(data.content);
    setLoading(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Cover letter</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {application.job_title} at {application.company_name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3" />
              Generating with Claude AI...
            </div>
          ) : content ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-200">
              {content}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
              Click "Generate" to create an AI cover letter for this role.
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors ml-auto"
          >
            <Sparkles size={14} />
            {content ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}