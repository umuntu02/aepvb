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
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import type { PartnerRow } from "@/lib/db/schema";

export default function AdminPartnersListPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [rows, setRows] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/api/admin/partners")
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
      await fetch("/api/admin/partners/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reordered.map((r) => r.id) }),
      });
    } catch {
      toast(adminFr.error, "error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.partnersTitle}</h2>
        <Button asChild size="sm">
          <Link href="/admin/partners/new">{adminFr.partnersAdd}</Link>
        </Button>
      </div>

      <p className="text-xs text-gray-400">{adminFr.partnersReorder}</p>

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
                    {row.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.logo} alt={row.name} className="w-12 h-8 object-contain rounded shrink-0" />
                    ) : (
                      <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center shrink-0 text-gray-300 text-xs">
                        logo
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{row.name}</p>
                      {row.website && (
                        <p className="text-xs text-gray-400 truncate">{row.website}</p>
                      )}
                    </div>
                    <Link href={`/admin/partners/${row.id}`} className="text-xs text-blue-600 hover:underline shrink-0">
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
