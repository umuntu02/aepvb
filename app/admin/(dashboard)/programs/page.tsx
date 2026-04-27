"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFr } from "@/lib/i18n/admin-fr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProgramRow } from "@/lib/db/schema";

export default function AdminProgramsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/programs")
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.programsTitle}</h2>
        <Button asChild size="sm">
          <Link href="/admin/programs/new">{adminFr.programsAdd}</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">{adminFr.loading}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">{adminFr.noResults}</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{adminFr.programsColTitle}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{adminFr.programsColSlug}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{adminFr.programsColStatus}</th>
                <th className="px-4 py-3" aria-label={adminFr.actions} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.titleFr}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden md:table-cell">{row.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={row.published ? "default" : "secondary"}>
                      {row.published ? adminFr.published : adminFr.draft}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/programs/${row.id}`} className="text-blue-600 hover:underline text-xs">
                      {adminFr.edit}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
