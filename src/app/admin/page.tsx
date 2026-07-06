import { db } from "@/db";
import { moderatorApplications } from "@/db/schema";
import { sql, eq, and, gte } from "drizzle-orm";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const allApps = await db.select().from(moderatorApplications);
  
  const total = allApps.length;
  const pending = allApps.filter(a => a.status === "Pending").length;
  const approved = allApps.filter(a => a.status === "Approved").length;
  const rejected = allApps.filter(a => a.status === "Rejected").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayApps = allApps.filter(a => new Date(a.createdAt) >= today).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-white/50">Welcome back, admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value={total.toString()} icon={Users} color="text-blue-400" bg="bg-blue-400/10" />
        <StatCard title="Pending Review" value={pending.toString()} icon={Clock} color="text-yellow-400" bg="bg-yellow-400/10" />
        <StatCard title="Approved" value={approved.toString()} icon={CheckCircle} color="text-green-400" bg="bg-green-400/10" />
        <StatCard title="Rejected" value={rejected.toString()} icon={XCircle} color="text-red-400" bg="bg-red-400/10" />
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <Link href="/admin/applications" className="text-sm text-gold hover:text-gold-hover">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/50 border-b border-white/10">
              <tr>
                <th className="pb-4 font-medium">Name</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Method</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allApps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">{app.fullName}</td>
                  <td className="py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">{app.verificationMethod}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link href={`/admin/applications/${app.id}`} className="text-gold hover:underline">Review</Link>
                  </td>
                </tr>
              ))}
              {allApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/50">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string; value: string; icon: any; color: string; bg: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-white/50 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
