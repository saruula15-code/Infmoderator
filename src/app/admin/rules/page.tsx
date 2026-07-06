import { db } from "@/db";
import { moderatorRules } from "@/db/schema";
import { asc } from "drizzle-orm";
import { AdminRulesList } from "./AdminRulesList";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const rules = await db.select().from(moderatorRules).orderBy(asc(moderatorRules.orderIndex));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Rules</h1>
      </div>

      <p className="text-white/50 text-sm">Rules are displayed to applicants on the Rules page. Keep them clear and updated.</p>

      <AdminRulesList initialRules={rules} />
    </div>
  );
}
