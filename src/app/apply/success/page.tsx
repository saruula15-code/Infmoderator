"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen pt-32 px-4 flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass-card rounded-2xl p-8 text-center flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
        <p className="text-white/60 mb-8">
          Thank you for applying to be a moderator. Your application is now <strong className="text-gold">Pending Review</strong>. We will contact you soon for the identity verification step.
        </p>
        <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors font-medium flex items-center gap-2">
          Return Home <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
