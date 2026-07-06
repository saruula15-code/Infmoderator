import { db } from "@/db";
import { moderatorRules } from "@/db/schema";
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function RulesPage() {
  const rules = await db.select().from(moderatorRules).orderBy(moderatorRules.orderIndex);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Moderator <span className="gold-gradient">Rules</span></h1>
          <p className="text-lg text-white/60">Strict rules and guidelines that all moderators must follow to maintain community integrity.</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-12 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Zero Tolerance Policy</h3>
            <p className="text-white/80 leading-relaxed text-sm">
              Violation of these rules will result in immediate termination of moderator privileges without prior warning. Security and respect are our top priorities.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="glass-card rounded-2xl p-6 md:p-8 flex gap-6 group hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <span className="font-bold text-gold text-xl">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{rule.title}</h3>
                <p className="text-white/70 leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
