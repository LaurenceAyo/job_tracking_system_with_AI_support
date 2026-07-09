"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import jobTrackerLogo from "@/icons/jobtracker_logo.png";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.includes("/login");
  const isSplitLayout = pathname.includes("/login") || pathname.includes("/register");

  if (!isSplitLayout) {
    // Forgot-password (and any future full-bleed pages) render on their own
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`flex flex-col justify-center px-12 py-12 w-full max-w-md bg-white z-10 ${isLogin ? "order-1" : "order-2"
          }`}
      >
        {children}
      </motion.div>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-white ${isLogin ? "order-2" : "order-1"
          }`}
      >
        <div
          className="absolute top-1/2 w-[120%] h-[140%] rounded-full"
          style={{
            background: "linear-gradient(135deg, #7be1d5 0%, #63ded1 40%, #8AD591 100%)",
            left: isLogin ? 0 : "auto",
            right: isLogin ? "auto" : 0,
            transform: `translateY(-50%) translateX(${isLogin ? "15%" : "-15%"})`,
          }}
        />
        <div className="relative ">
          <div className="w-100 h-100 flex items-center justify-center">
            <Image src={jobTrackerLogo} alt="JobTracker Logo" className="w-full h-auto object-contain" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}