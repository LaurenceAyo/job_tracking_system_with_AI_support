"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import jobTrackerLogo from "../../../icons/jobtracker_logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setError("");

    // 1. Client-side Input Validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // 2. Database Authentication
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    // 3. Error Handling & State Reset
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else {
        setError(error.message);
      }
      setLoading(false); // Stop loading only if there's an error
    } else {
      router.push("/dashboard"); // Successful login redirects, no need to turn off loading
    }
  }
  return (
    <div className="min-h-screen flex">
      {/* LEFT — Form panel */}
      <div className="flex flex-col justify-center px-10 py-12 w-full max-w-md bg-white">

        {/* Logo */}
        <div className="mb-10">
          <span className="flex ml-20 text-5xl font-semibold text-gray-900">
            Job<span className="text-blue-600 font-light ">
              Flow</span>
          </span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome Back!</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-1">

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t Have an Account?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>

      {/* RIGHT — Brand panel */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-white">

        {/* The Big Curved Gradient Ball */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 w-[180%] h-[150%] rounded-full"
          style={{
            background: "linear-gradient(135deg, #7be1d5 0%, #63ded1 40%, #8AD591 100%)"
          }}
        />
        {/* Center content — z-10 for layering */}
        <div className="relative z-10 flex flex-col items-center gap-6">

          {/* Replace SVG Placeholder with Logo Image */}
          <div className=" translate-y-10 w-100 h-100 flex items-center justify-center">
            <Image
              src={jobTrackerLogo}
              alt="JobTracker Logo"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </div>
  );
}