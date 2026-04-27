import Link from "next/link";
import {
  Newspaper,
  CalendarDays,
  ImageIcon,
  BookOpen,
  Clock,
} from "lucide-react";
import { getDashboardStats, getRecentActivity } from "@/lib/db/queries/admin";
import { adminFr } from "@/lib/i18n/admin-fr";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function formatActivity(updatedAt: Date): string {
  const days = Math.floor(
    (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 7) return adminFr.daysAgo(days);
  return updatedAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TYPE_ICONS = {
  news: Newspaper,
  events: CalendarDays,
  gallery: ImageIcon,
  programs: BookOpen,
} as const;

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(5),
  ]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <h2 className="text-xl font-semibold text-gray-900">{adminFr.dashboardTitle}</h2>

      {/* Stats */}
      <section aria-label="Statistiques">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={adminFr.statsNews}
            value={stats.news}
            icon={Newspaper}
          />
          <StatCard
            label={adminFr.statsEvents}
            value={stats.eventsUpcoming + stats.eventsPast}
            icon={CalendarDays}
            sub={`${stats.eventsUpcoming} ${adminFr.statsUpcoming} · ${stats.eventsPast} ${adminFr.statsPast}`}
          />
          <StatCard
            label={adminFr.statsGallery}
            value={stats.gallery}
            icon={ImageIcon}
          />
          <StatCard
            label={adminFr.statsPrograms}
            value={stats.programs}
            icon={BookOpen}
          />
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent activity */}
        <section
          aria-label={adminFr.recentActivity}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden />
            {adminFr.recentActivity}
          </h3>

          {activity.length === 0 ? (
            <p className="text-sm text-gray-400">{adminFr.noResults}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {activity.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                return (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 text-sm hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" aria-hidden />
                      <span className="flex-1 text-gray-700 line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-gray-400 text-xs shrink-0">
                        {formatActivity(item.updatedAt)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Quick add */}
        <section
          aria-label={adminFr.quickAdd}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {adminFr.quickAdd}
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: adminFr.quickAddNews, href: "/admin/news/new", icon: Newspaper },
              { label: adminFr.quickAddEvent, href: "/admin/events/new", icon: CalendarDays },
              { label: adminFr.quickAddPhoto, href: "/admin/gallery/new", icon: ImageIcon },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
