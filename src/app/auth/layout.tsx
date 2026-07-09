"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import jobTrackerLogo from "../../icons/jobtracker_logo.png"; // adjust path

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.includes("/login");

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Form side */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`flex flex-col justify-center px-10 py-12 w-full max-w-md bg-white z-10 ${isLogin ? "order-1" : "order-2"
          }`}
      >
        {children}
      </motion.div>

      {/* Gradient ball side */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`hidden md:flex flex-1 items-center justify-center relative overflow-hidden bg-white ${isLogin ? "order-2" : "order-1"
          }`}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[100%] h-[140%] rounded-full  ${isLogin ? "left-60" : "right-60"
            }`}
          style={{
            background: "linear-gradient(135deg, #7be1d5 0%, #63ded1 40%, #8AD591 100%)",
          }}
        />
        {/* Logo — anchored to ball's actual center */}
        <div
          className="absolute z-10 flex flex-col items-center gap-6"
          style={{
            top: "50%",
            left: isLogin ? "65%" : "35%", // ball center: left-0 ball centers at 65%, right-0 ball centers at 35%
            transform: "translate(-50%, -50%) translate(0px, 0px)", // <- tweak the last two values (x, y) to nudge manually
          }}
        >
          <div className="w-80 h-80 flex items-center justify-center">
            <Image src={jobTrackerLogo} alt="JobTracker Logo" className="w-full h-auto object-contain" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}