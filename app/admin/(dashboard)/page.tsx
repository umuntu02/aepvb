import Link from "next/link";
import {
  Newspaper,
  CalendarDays,
  ImageIcon,
  BookOpen,
  Clock,
  MonitorPlay,
  BarChart3,
  MessageSquareQuote,
  Megaphone,
  Handshake,
  ExternalLink,
  Plus,
} from "lucide-react";
import { getContentSummary, getRecentActivity } from "@/lib/db/queries/admin";
import { adminFr } from "@/lib/i18n/admin-fr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface SectionCardProps {
  label: string;
  icon: React.ElementType;
  editHref: string;
  previewAnchor: string;
  published: number;
  draft: number;
  total: number;
}

function SectionCard({
  label,
  icon: Icon,
  editHref,
  previewAnchor,
  published,
  draft,
  total,
}: SectionCardProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const previewUrl = `/api/admin/preview?section=${previewAnchor}`;

  return (
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <Icon className="h-4 w-4 text-blue-600" aria-hidden />
          </div>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
          {published > 0 && (
            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 text-xs">
              {adminFr.dashboardPublished(published)}
            </Badge>
          )}
          {draft > 0 && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-xs">
              {adminFr.dashboardDraft(draft)}
            </Badge>
          )}
          {total === 0 && (
            <span className="text-xs text-gray-400">{adminFr.noResults}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="default" className="flex-1 text-xs h-8">
            <Link href={editHref}>{adminFr.dashboardModify}</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs h-8 gap-1">
            <Link href={previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" aria-hidden />
              {adminFr.dashboardPreview}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
        <Icon className="h-4 w-4 text-blue-600" aria-hidden />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [summary, activity] = await Promise.all([
    getContentSummary(),
    getRecentActivity(5),
  ]);

  const sections: SectionCardProps[] = [
    {
      label: adminFr.dashboardSectionHero,
      icon: MonitorPlay,
      editHref: "/admin/sections/hero",
      previewAnchor: "hero",
      published: summary.hero.published,
      draft: summary.hero.draft,
      total: summary.hero.total,
    },
    {
      label: adminFr.dashboardSectionHighlights,
      icon: BarChart3,
      editHref: "/admin/sections/highlights",
      previewAnchor: "highlights",
      published: summary.highlights.published,
      draft: summary.highlights.draft,
      total: summary.highlights.total,
    },
    {
      label: adminFr.dashboardSectionNews,
      icon: Newspaper,
      editHref: "/admin/news",
      previewAnchor: "news",
      published: summary.news.published,
      draft: summary.news.draft,
      total: summary.news.total,
    },
    {
      label: adminFr.dashboardSectionPartners,
      icon: Handshake,
      editHref: "/admin/partners",
      previewAnchor: "partners",
      published: summary.partners.published,
      draft: summary.partners.draft,
      total: summary.partners.total,
    },
    {
      label: adminFr.dashboardSectionTestimonials,
      icon: MessageSquareQuote,
      editHref: "/admin/sections/testimonials",
      previewAnchor: "testimonials",
      published: summary.testimonials.published,
      draft: summary.testimonials.draft,
      total: summary.testimonials.total,
    },
    {
      label: adminFr.dashboardSectionCta,
      icon: Megaphone,
      editHref: "/admin/sections/cta",
      previewAnchor: "cta",
      published: 1,
      draft: 0,
      total: 1,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-900">{adminFr.dashboardTitle}</h2>

      {/* Quick actions bar */}
      <section aria-label={adminFr.quickAdd}>
        <div className="flex flex-wrap gap-2">
          {[
            { label: adminFr.quickAddNews, href: "/admin/news/new", icon: Newspaper },
            { label: adminFr.quickAddEvent, href: "/admin/events/new", icon: CalendarDays },
            { label: adminFr.quickAddPhoto, href: "/admin/gallery/new", icon: ImageIcon },
            { label: adminFr.dashboardQuickAddSlide, href: "/admin/sections/hero/new", icon: MonitorPlay },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-3 w-3" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Site visual map — left 2/3 */}
        <section aria-label={adminFr.dashboardSiteMap} className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">{adminFr.dashboardSiteMap}</h3>
          <p className="text-xs text-gray-400 -mt-2">
            Sections de la page d&apos;accueil publique, dans l&apos;ordre d&apos;affichage.
          </p>
          <div className="flex flex-col gap-3">
            {sections.map((s) => (
              <SectionCard key={s.editHref} {...s} />
            ))}
          </div>
        </section>

        {/* Right column — stats + recent activity */}
        <div className="flex flex-col gap-6">
          {/* Stats panel */}
          <section aria-label={adminFr.dashboardStatsPanel}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{adminFr.dashboardStatsPanel}</h3>
            <div className="flex flex-col gap-2">
              <StatCard
                label={adminFr.statsNews}
                value={summary.news.total}
                icon={Newspaper}
                sub={`${summary.news.published} publiées · ${summary.news.draft} brouillons`}
              />
              <StatCard
                label={adminFr.statsEvents}
                value={summary.events.total}
                icon={CalendarDays}
                sub={`${summary.events.upcoming} ${adminFr.statsUpcoming} · ${summary.events.past} ${adminFr.statsPast}`}
              />
              <StatCard
                label={adminFr.statsGallery}
                value={summary.gallery.total}
                icon={ImageIcon}
              />
              <StatCard
                label={adminFr.statsPrograms}
                value={summary.programs.total}
                icon={BookOpen}
                sub={`${summary.programs.published} publiés`}
              />
            </div>
          </section>

          {/* Recent activity */}
          <section
            aria-label={adminFr.recentActivity}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {adminFr.recentActivity}
            </h3>

            {activity.length === 0 ? (
              <p className="text-sm text-gray-400">{adminFr.noResults}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {activity.map((item) => {
                  const Icon = TYPE_ICONS[item.type];
                  return (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={item.href}
                        className="flex items-start gap-2 text-xs hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" aria-hidden />
                        <span className="flex-1 text-gray-700 line-clamp-1">{item.title}</span>
                        <span className="text-gray-400 shrink-0">{formatActivity(item.updatedAt)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
