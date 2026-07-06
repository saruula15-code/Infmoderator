"use client";

import { Search } from "lucide-react";

export function ApplicationsFilterForm({ q, status }: { q: string; status: string }) {
  return (
    <form className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name, phone, school..."
          className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-gold w-full sm:w-64 text-sm"
        />
      </div>
      <select
        name="status"
        defaultValue={status || "All"}
        className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-gold text-sm appearance-none"
        onChange={(e) => {
          const form = e.target.form;
          if (form) form.submit();
        }}
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button type="submit" className="hidden">Submit</button>
    </form>
  );
}
