"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/app/admin/_components/SortableItem";
import { adminFr } from "@/lib/i18n/admin-fr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import type { TestimonialRow } from "@/lib/db/schema";

export default function TestimonialsListPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/admin/sections/testimonials")
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const reordered = arrayMove(rows, rows.findIndex((r) => r.id === active.id), rows.findIndex((r) => r.id === over.id));
    setRows(reordered);
    try {
      await fetch("/api/admin/sections/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "testimonials", orderedIds: reordered.map((r) => r.id) }),
      });
    } catch { toast(adminFr.error, "error"); }
  }

  async function toggleStatus(row: TestimonialRow) {
    const newStatus = row.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/sections/testimonials/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) { toast(adminFr.error, "error"); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, status: newStatus } : r));
    toast(adminFr.success);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.testimonialsTitle}</h2>
        <Button asChild size="sm"><Link href="/admin/sections/testimonials/new">{adminFr.testimonialsAdd}</Link></Button>
      </div>
      <p className="text-xs text-gray-400">{adminFr.testimonialsReorder}</p>
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
                    {row.authorPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.authorPhoto} alt={row.authorName} className="w-10 h-10 object-cover rounded-full shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" aria-hidden />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{row.authorName}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {row.contentFr.length > 60 ? row.contentFr.slice(0, 57) + "…" : row.contentFr}
                      </p>
                    </div>
                    <Badge
                      className={
                        row.status === "published"
                          ? "bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200 cursor-pointer hover:bg-amber-200"
                      }
                      onClick={() => toggleStatus(row)}
                    >
                      {row.status === "published" ? adminFr.published : adminFr.draft}
                    </Badge>
                    <Link href={`/admin/sections/testimonials/${row.id}`} className="text-xs text-blue-600 hover:underline shrink-0">
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
