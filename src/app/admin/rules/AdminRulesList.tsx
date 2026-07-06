"use client";
import { useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AdminRulesList({ initialRules }: { initialRules: any[] }) {
  const [rules, setRules] = useState(initialRules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", orderIndex: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleEdit = (rule: any) => {
    setEditingId(rule.id);
    setEditForm({ title: rule.title, description: rule.description, orderIndex: rule.orderIndex });
  };

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to save rule");
      
      const updated = await res.json();
      setRules(rules.map(r => r.id === id ? updated.rule : r));
      setEditingId(null);
      toast.success("Rule updated");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    try {
      const res = await fetch(`/api/admin/rules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRules(rules.filter(r => r.id !== id));
      toast.success("Rule deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`/api/admin/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, orderIndex: rules.length + 1 }),
      });
      if (!res.ok) throw new Error("Failed to create rule");
      
      const created = await res.json();
      setRules([...rules, created.rule]);
      setIsAdding(false);
      setEditForm({ title: "", description: "", orderIndex: 0 });
      toast.success("Rule added");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={() => { setIsAdding(true); setEditForm({ title: "", description: "", orderIndex: 0 }); }}
          className="px-4 py-2 bg-gold hover:bg-gold-hover text-black font-medium rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-2xl p-6 border border-gold/30">
          <h3 className="text-lg font-bold mb-4 text-gold">New Rule</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Rule Title"
              value={editForm.title}
              onChange={e => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold"
            />
            <textarea 
              placeholder="Rule Description"
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold h-24 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-gold hover:bg-gold-hover text-black font-medium rounded-xl transition-colors text-sm">Save Rule</button>
            </div>
          </div>
        </div>
      )}

      {rules.map((rule, index) => (
        <div key={rule.id} className="glass-card rounded-2xl p-6 group">
          {editingId === rule.id ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold"
              />
              <textarea 
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-gold h-24 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm flex items-center gap-2"><X className="w-4 h-4"/> Cancel</button>
                <button onClick={() => handleSave(rule.id)} className="px-4 py-2 bg-gold hover:bg-gold-hover text-black font-medium rounded-xl transition-colors text-sm flex items-center gap-2"><Save className="w-4 h-4"/> Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white/50 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-gold transition-colors">{rule.title}</h3>
                  <p className="text-white/60 text-sm">{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(rule)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-gold transition-colors" title="Засах">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Устгах">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
