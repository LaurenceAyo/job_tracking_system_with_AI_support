"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister() {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("An account with this email already exists.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <>
      {/* Logo */}
      <div className="mb-10 text-center">
        <span className="text-5xl font-semibold text-gray-900">
          Job<span className="text-blue-600 font-light">Flow</span>
        </span>
      </div>

      <h1 className="text-xl font-semibold text-gray-900 mb-1 text-center">Sign-up</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 mt-4">
        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            readOnly
            onClick={() => setShowTermsModal(true)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="terms"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="text-sm text-gray-700 cursor-pointer hover:underline"
          >
            I accept to the terms and conditions.
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading || !acceptedTerms}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
            acceptedTerms
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-300 text-white cursor-not-allowed"
          } disabled:opacity-50`}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already Have an Account?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsModal
          onCancel={() => setShowTermsModal(false)}
          onAgree={() => {
            setAcceptedTerms(true);
            setShowTermsModal(false);
          }}
        />
      )}
    </>
  );
}

function TermsModal({ onCancel, onAgree }: { onCancel: () => void; onAgree: () => void }) {
  const [checked, setChecked] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-mono text-base font-semibold text-gray-900">Terms and Conditions</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-4 max-h-72 overflow-y-auto text-sm text-gray-700 space-y-3">
          <div>
            <p className="font-bold">Introduction</p>
            <p>Last Updated: June 29, 2026</p>
            <p>
              Welcome to JobFlow. By accessing or using this Job Tracking System, you agree to
              comply with and be bound by the following Terms and Conditions. Please read them
              carefully before using the system.
            </p>
          </div>
          <div>
            <p className="font-semibold">1. Acceptance of Terms</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div>
            <p className="font-semibold">2. User Accounts</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
          <div>
            <p className="font-semibold">3. Acceptable Use</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
              libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh imperdiet.
            </p>
          </div>
          <div>
            <p className="font-semibold">4. Privacy and Data Collection</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet...</p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="px-6 pt-2 pb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            I agree to the terms and conditions.
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onAgree}
            disabled={!checked}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
              checked ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Agree and Continue
          </button>
        </div>
      </div>
    </div>
  );
}