"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  ImageIcon,
  BookOpen,
  Users,
  Handshake,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { adminFr } from "@/lib/i18n/admin-fr";

const NAV_ITEMS = [
  { label: adminFr.navDashboard, href: "/admin", icon: LayoutDashboard },
  { label: adminFr.navNews, href: "/admin/news", icon: Newspaper },
  { label: adminFr.navEvents, href: "/admin/events", icon: CalendarDays },
  { label: adminFr.navGallery, href: "/admin/gallery", icon: ImageIcon },
  { label: adminFr.navPrograms, href: "/admin/programs", icon: BookOpen },
  { label: adminFr.navTeam, href: "/admin/team", icon: Users },
  { label: adminFr.navPartners, href: "/admin/partners", icon: Handshake },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  pathname: string;
  onClick?: () => void;
}) {
  const active =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <item.icon className="h-4 w-4 shrink-0" aria-hidden />
      {item.label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentSection =
    NAV_ITEMS.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )?.label ?? adminFr.navDashboard;

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Administration
        </p>
        <p className="text-base font-bold text-gray-900 mt-0.5">AEPVB</p>
      </div>

      <nav
        aria-label="Navigation administration"
        className="flex-1 px-3 py-4 flex flex-col gap-1"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onClose}
          />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          {adminFr.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Administration</p>
          <p className="text-sm font-semibold text-gray-900">{currentSection}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="relative z-50 w-64 bg-white h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
