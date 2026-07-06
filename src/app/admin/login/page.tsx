"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      toast.success("Login successful");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[128px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
            <Shield className="w-8 h-8 text-gold" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Admin Panel</h1>
        <p className="text-white/50 text-center mb-8 text-sm">Sign in to manage applications and rules.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
