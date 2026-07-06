"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trash2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ApplicationActions({ id, currentStatus, adminNote: initialNote }: { id: string, currentStatus: string, adminNote: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(initialNote);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const saveNote = async () => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: note }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setIsEditingNote(false);
      toast.success("Admin note saved");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteApp = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Application deleted");
      router.push("/admin/applications");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4">
      <div className="flex items-center gap-2">
        {status !== "Approved" && (
          <button onClick={() => updateStatus("Approved")} className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Approve
          </button>
        )}
        {status !== "Rejected" && (
          <button onClick={() => updateStatus("Rejected")} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium">
            <XCircle className="w-4 h-4" /> Reject
          </button>
        )}
        <button onClick={deleteApp} className="p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 border border-white/10 rounded-xl transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full sm:w-80 glass p-4 rounded-xl relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Admin Note</span>
          {!isEditingNote && (
            <button onClick={() => setIsEditingNote(true)} className="text-white/30 hover:text-gold transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <AnimatePresence mode="wait">
          {isEditingNote ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <textarea 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add private note..."
                className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-gold resize-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditingNote(false)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors">Cancel</button>
                <button onClick={saveNote} className="px-3 py-1 bg-gold hover:bg-gold-hover text-black rounded-lg text-xs font-medium transition-colors">Save</button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm min-h-[2.5rem]">
              {note ? <span className="text-white/80 whitespace-pre-wrap">{note}</span> : <span className="text-white/30 italic">No notes added.</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
