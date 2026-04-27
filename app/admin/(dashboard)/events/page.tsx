"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFr } from "@/lib/i18n/admin-fr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EventRow } from "@/lib/db/schema";

export default function AdminEventsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.eventsTitle}</h2>
        <Button asChild size="sm">
          <Link href="/admin/events/new">{adminFr.eventsAdd}</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">{adminFr.loading}</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-gray-400">{adminFr.noResults}</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{adminFr.eventsColTitle}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">{adminFr.eventsColDate}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{adminFr.eventsColLocation}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{adminFr.eventsColStatus}</th>
                <th className="px-4 py-3" aria-label={adminFr.actions} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((row) => {
                const upcoming = row.date >= today;
                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{row.titleFr}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {row.date}
                      <Badge className="ml-2" variant={upcoming ? "default" : "secondary"}>
                        {upcoming ? adminFr.eventsUpcoming : adminFr.eventsPast}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{row.locationFr}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.published ? "default" : "secondary"}>
                        {row.published ? adminFr.published : adminFr.draft}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/events/${row.id}`} className="text-blue-600 hover:underline text-xs">
                        {adminFr.edit}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
