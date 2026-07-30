"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, FileText, Award, Upload, X, Check, Loader2 } from "lucide-react";

type UploadState = {
  resume: File | null;
  certificates: File | null;
};

type UploadedState = {
  resume: string | null;
  certificates: string | null;
};

export default function ProfilePage() {
  const supabase = createClient();

  const [editing, setEditing] = useState<{ resume: boolean; certificates: boolean }>({
    resume: false,
    certificates: false,
  });

  const [files, setFiles] = useState<UploadState>({
    resume: null,
    certificates: null,
  });

  const [uploaded, setUploaded] = useState<UploadedState>({
    resume: null,
    certificates: null,
  });

  const [uploading, setUploading] = useState<{ resume: boolean; certificates: boolean }>({
    resume: false,
    certificates: false,
  });

  const [dragOver, setDragOver] = useState<{ resume: boolean; certificates: boolean }>({
    resume: false,
    certificates: false,
  });

  const [loadingExisting, setLoadingExisting] = useState(true);

  const resumeRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLInputElement>(null);

  // Load existing uploaded files on mount
  useEffect(() => {
    async function loadExistingFiles() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sections = [
        { key: "resume" as const, extensions: ["pdf", "docx", "doc"] },
        { key: "certificates" as const, extensions: ["pdf", "docx", "doc", "jpg", "jpeg", "png"] },
      ];

      const found: UploadedState = { resume: null, certificates: null };

      for (const section of sections) {
        for (const ext of section.extensions) {
          const path = `${user.id}/${section.key}.${ext}`;
          const { data } = await supabase.storage
            .from("profile-files")
            .list(user.id, { search: `${section.key}.${ext}` });

          if (data && data.length > 0) {
            found[section.key] = `${section.key}.${ext}`;
            break;
          }
        }
      }

      setUploaded(found);
      setLoadingExisting(false);
    }

    loadExistingFiles();
  }, []);

  function handleFileSelect(section: "resume" | "certificates", file: File) {
    setFiles((prev) => ({ ...prev, [section]: file }));
  }

  function handleDrop(section: "resume" | "certificates", e: React.DragEvent) {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [section]: false }));
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(section, file);
  }

  async function handleUpload(section: "resume" | "certificates") {
    const file = files[section];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [section]: true }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${section}.${ext}`;

    const { error } = await supabase.storage
      .from("profile-files")
      .upload(path, file, { upsert: true });

    if (!error) {
      setUploaded((prev) => ({ ...prev, [section]: file.name }));
      setFiles((prev) => ({ ...prev, [section]: null }));
      setEditing((prev) => ({ ...prev, [section]: false }));
    } else {
      alert("Upload failed: " + error.message);
    }

    setUploading((prev) => ({ ...prev, [section]: false }));
  }

  function handleCancel(section: "resume" | "certificates") {
    setFiles((prev) => ({ ...prev, [section]: null }));
    setEditing((prev) => ({ ...prev, [section]: false }));
  }

  const sections = [
    {
      key: "resume" as const,
      label: "Resume",
      icon: FileText,
      ref: resumeRef,
      accept: ".doc,.docx,.pdf",
      hint: "Supported Formats: DOC, DOCX, PDF · Maximum Size: 15 MB",
    },
    {
      key: "certificates" as const,
      label: "Certificates",
      icon: Award,
      ref: certRef,
      accept: ".doc,.docx,.pdf,.jpg,.jpeg,.png",
      hint: "Supported Formats: DOC, DOCX, PDF · Maximum Size: 15 MB",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h1>

      {loadingExisting ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading your files...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {sections.map(({ key, label, icon: Icon, ref, accept, hint }) => (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Section header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Icon size={16} className="text-gray-500" />
                  {label}
                </div>
                {!editing[key] && (
                  <button
                    onClick={() => setEditing((prev) => ({ ...prev, [key]: true }))}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-3 py-1 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                {uploaded[key] && !editing[key] ? (
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                    <span className="truncate">{uploaded[key]}</span>
                  </div>
                ) : editing[key] || !uploaded[key] ? (
                  <div className="flex flex-col gap-4">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver((p) => ({ ...p, [key]: true })); }}
                      onDragLeave={() => setDragOver((p) => ({ ...p, [key]: false }))}
                      onDrop={(e) => handleDrop(key, e)}
                      onClick={() => ref.current?.click()}
                      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-colors ${
                        dragOver[key]
                          ? "border-blue-400 bg-blue-50"
                          : files[key]
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      {files[key] ? (
                        <>
                          <FileText size={28} className="text-blue-500 mb-2" />
                          <p className="text-sm font-medium text-blue-700 truncate max-w-xs px-2">
                            {files[key]!.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {(files[key]!.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500">
                            Drag and drop file or{" "}
                            <span className="text-blue-600 underline">Choose here</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-2 text-center px-4">{hint}</p>
                        </>
                      )}
                    </div>

                    <input
                      ref={ref}
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(key, file);
                      }}
                    />

                    {files[key] && (
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => handleCancel(key)}
                          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpload(key)}
                          disabled={uploading[key]}
                          className="flex items-center gap-1.5 text-sm text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          <Upload size={14} />
                          {uploading[key] ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}