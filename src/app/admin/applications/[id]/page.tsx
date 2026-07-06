import { db } from "@/db";
import { moderatorApplications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, User, Phone, MapPin, School, Link as LinkIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ApplicationActions } from "./ApplicationActions";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  
  const [app] = await db.select().from(moderatorApplications).where(eq(moderatorApplications.id, id));
  if (!app) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/applications" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{app.fullName}</h1>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              app.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
              app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}>
              {app.status}
            </span>
            <span className="text-sm text-white/50">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <ApplicationActions id={app.id} currentStatus={app.status} adminNote={app.adminNote || ""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold border-b border-white/10 pb-3 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={Phone} label="Phone" value={app.phone} />
              <InfoItem icon={User} label="Email" value={app.email} />
              <InfoItem icon={MapPin} label="Address" value={app.address} />
              <InfoItem icon={LinkIcon} label="Facebook" value={<a href={app.facebookLink} target="_blank" className="text-blue-400 hover:underline break-all">{app.facebookLink}</a>} />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold border-b border-white/10 pb-3 mb-4">School & Guardian</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={School} label="School Name" value={app.schoolName || "N/A"} />
              <InfoItem icon={User} label="Class Name" value={app.className || "N/A"} />
              <InfoItem icon={User} label="Teacher Name" value={app.teacherName || "N/A"} />
              <InfoItem icon={Phone} label="Teacher Phone" value={app.teacherPhone || "N/A"} />
              <InfoItem icon={Phone} label="Parent Phone" value={app.parentPhone || "N/A"} />
              <InfoItem icon={LinkIcon} label="Parent Facebook" value={app.parentFacebook ? <a href={app.parentFacebook} target="_blank" className="text-blue-400 hover:underline break-all">{app.parentFacebook}</a> : "N/A"} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gold border-b border-white/10 pb-3 mb-4">Verification</h2>
            <div className="mb-6">
              <p className="text-sm text-white/50 mb-1">Preferred Method</p>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="font-medium">{app.verificationMethod}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/50 mb-2">ID Document</p>
                <a href={app.idDocumentUrl} target="_blank" rel="noreferrer" className="block w-full aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-gold/50 transition-colors relative group">
                  {/* Since they are generic URLs, we can use an img tag if it's an image. Cloudinary usually returns images. */}
                  {app.idDocumentUrl.endsWith('.pdf') ? (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-sm">View PDF</div>
                  ) : (
                    <img src={app.idDocumentUrl} alt="ID Document" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1 bg-black/80 rounded-lg text-sm">Open Original</span>
                  </div>
                </a>
              </div>
              
              <div>
                <p className="text-sm text-white/50 mb-2">Face Photo</p>
                <a href={app.facePhotoUrl} target="_blank" rel="noreferrer" className="block w-full aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-gold/50 transition-colors relative group">
                  <img src={app.facePhotoUrl} alt="Face Photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-3 py-1 bg-black/80 rounded-lg text-sm">Open Original</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-white/50 mb-0.5">{label}</p>
        <div className="text-white font-medium">{value}</div>
      </div>
    </div>
  );
}
