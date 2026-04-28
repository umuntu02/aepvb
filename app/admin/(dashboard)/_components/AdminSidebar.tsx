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
  MonitorPlay,
  BarChart3,
  MessageSquareQuote,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { adminFr } from "@/lib/i18n/admin-fr";

const SECTION_ITEMS = [
  { label: adminFr.navSectionHero, href: "/admin/sections/hero", icon: MonitorPlay },
  { label: adminFr.navSectionHighlights, href: "/admin/sections/highlights", icon: BarChart3 },
  { label: adminFr.navSectionTestimonials, href: "/admin/sections/testimonials", icon: MessageSquareQuote },
  { label: adminFr.navSectionCta, href: "/admin/sections/cta", icon: Megaphone },
  { label: adminFr.navSectionPartners, href: "/admin/partners", icon: Handshake },
];

const CONTENT_ITEMS = [
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
  item: { label: string; href: string; icon: React.ElementType };
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

interface SidebarContentProps {
  pathname: string;
  sectionsOpen: boolean;
  onToggleSections: () => void;
  onLogout: () => void;
  onClose?: () => void;
}

function SidebarContent({ pathname, sectionsOpen, onToggleSections, onLogout, onClose }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-5 border-b border-gray-200 shrink-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Administration
        </p>
        <p className="text-base font-bold text-gray-900 mt-0.5">AEPVB</p>
      </div>

      <nav
        aria-label="Navigation administration"
        className="flex-1 px-3 py-4 flex flex-col gap-1"
      >
        <NavLink
          item={{ label: adminFr.navDashboard, href: "/admin", icon: LayoutDashboard }}
          pathname={pathname}
          onClick={onClose}
        />

        <div className="mt-3">
          <button
            onClick={onToggleSections}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
            aria-expanded={sectionsOpen}
          >
            <span>{adminFr.navSectionsGroup}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${sectionsOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          {sectionsOpen && (
            <div className="flex flex-col gap-1 mt-1">
              {SECTION_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Contenu
          </p>
          <div className="flex flex-col gap-1 mt-1">
            {CONTENT_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
            ))}
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 shrink-0">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          {adminFr.logout}
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(
    pathname.startsWith("/admin/sections") || pathname.startsWith("/admin/partners")
  );

  const currentSection =
    [...SECTION_ITEMS, ...CONTENT_ITEMS].find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )?.label ?? adminFr.navDashboard;

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  function toggleSections() {
    setSectionsOpen((v) => !v);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        <SidebarContent
          pathname={pathname}
          sectionsOpen={sectionsOpen}
          onToggleSections={toggleSections}
          onLogout={handleLogout}
        />
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
            <SidebarContent
              pathname={pathname}
              sectionsOpen={sectionsOpen}
              onToggleSections={toggleSections}
              onLogout={handleLogout}
              onClose={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
