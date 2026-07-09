"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ForgotPasswordImage from "@/icons/Forgot_Password.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleReset() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a password reset link.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white px-4">
      {/* Background gradient blobs */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-90"
        style={{
          background: "linear-gradient(135deg, #7be1d5 0%, #63ded1 40%, #8AD591 100%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-90"
        style={{
          background: "linear-gradient(135deg, #7be1d5 0%, #63ded1 40%, #8AD591 100%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
        <span className="text-4xl font-semibold text-gray-900 mb-6">
          Job<span className="text-blue-600 font-light">Flow</span>
        </span>

        <div className="relative ">
          <div className="w-100 h-100 flex items-center justify-center">
            <Image src={ForgotPasswordImage} alt="Forgot Password" className="w-full h-auto object-contain" />
          </div>
        </div>

        <h1 className="text-lg font-semibold text-gray-900 mb-1">Forgot your Password?</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to enable password reset</p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="relative w-full mb-4">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>

        <p className="text-sm text-gray-500 mb-4">
          Don&apos;t Have an Account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Create one
          </Link>
        </p>

        <Link
          href="/auth/login"
          className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}