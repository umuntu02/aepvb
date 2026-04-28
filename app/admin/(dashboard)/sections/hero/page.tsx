"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/app/admin/_components/SortableItem";
import { adminFr } from "@/lib/i18n/admin-fr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import type { HeroSlideRow } from "@/lib/db/schema";

export default function HeroListPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [rows, setRows] = useState<HeroSlideRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/admin/sections/hero")
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = rows.findIndex((r) => r.id === active.id);
    const newIdx = rows.findIndex((r) => r.id === over.id);
    const reordered = arrayMove(rows, oldIdx, newIdx);
    setRows(reordered);
    try {
      await fetch("/api/admin/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", orderedIds: reordered.map((r) => r.id) }),
      });
    } catch {
      toast(adminFr.error, "error");
    }
  }

  async function toggleStatus(row: HeroSlideRow) {
    const newStatus = row.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/sections/hero/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, status: newStatus } : r));
      toast(adminFr.success);
    } catch {
      toast(adminFr.error, "error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.heroTitle}</h2>
        <Button asChild size="sm">
          <Link href="/admin/sections/hero/new">{adminFr.heroAdd}</Link>
        </Button>
      </div>

      <p className="text-xs text-gray-400">{adminFr.heroReorder}</p>

      {loading ? (
        <p className="text-sm text-gray-400">{adminFr.loading}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">{adminFr.noResults}</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <SortableItem key={row.id} id={row.id}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-10 rounded overflow-hidden shrink-0 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={row.image} alt={row.altFr} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{row.titleFr}</p>
                    </div>
                    <Badge
                      className={
                        row.status === "published"
                          ? "bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200 cursor-pointer hover:bg-amber-200"
                      }
                      onClick={() => toggleStatus(row)}
                      title="Cliquez pour changer le statut"
                    >
                      {row.status === "published" ? adminFr.published : adminFr.draft}
                    </Badge>
                    <Link href={`/admin/sections/hero/${row.id}`} className="text-xs text-blue-600 hover:underline shrink-0">
                      {adminFr.edit}
                    </Link>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
