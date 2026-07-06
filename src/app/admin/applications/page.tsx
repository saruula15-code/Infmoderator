import { db } from "@/db";
import { moderatorApplications } from "@/db/schema";
import { sql, ilike, or, eq, desc } from "drizzle-orm";
import Link from "next/link";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { ApplicationsFilterForm } from "./ApplicationsFilterForm";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { q = "", status = "" } = await searchParams;

  let query = db.select().from(moderatorApplications).orderBy(desc(moderatorApplications.createdAt));
  let results = await query;

  if (q) {
    const qLower = q.toLowerCase();
    results = results.filter(a => 
      a.fullName.toLowerCase().includes(qLower) || 
      a.phone.includes(q) || 
      a.facebookLink.toLowerCase().includes(qLower) ||
      (a.schoolName && a.schoolName.toLowerCase().includes(qLower))
    );
  }

  if (status && status !== "All") {
    results = results.filter(a => a.status === status);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        
        <ApplicationsFilterForm q={q} status={status} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium text-white/50">Applicant</th>
                <th className="px-6 py-4 font-medium text-white/50">Contact</th>
                <th className="px-6 py-4 font-medium text-white/50">Date</th>
                <th className="px-6 py-4 font-medium text-white/50">Status</th>
                <th className="px-6 py-4 font-medium text-white/50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{app.fullName}</div>
                    <div className="text-xs text-white/50">{app.schoolName || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{app.phone}</div>
                    <div className="text-xs text-white/50 truncate w-32">{app.email}</div>
                  </td>
                  <td className="px-6 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/applications/${app.id}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
