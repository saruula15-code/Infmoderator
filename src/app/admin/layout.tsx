"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/applications", icon: Users, label: "Applications" },
    { href: "/admin/rules", icon: FileText, label: "Rules" },
  ];

  return (
    <div className="min-h-screen bg-black-bg flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 glass-card border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold" />
            <span className="font-semibold tracking-wide">ADMIN<span className="text-gold">PRO</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive ? "bg-gold/10 text-gold font-medium border border-gold/20" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={clsx("w-5 h-5", isActive ? "text-gold" : "text-white/40")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative min-h-screen">
        <div className="p-6 md:p-10 max-w-7xl mx-auto pt-20 md:pt-10">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
