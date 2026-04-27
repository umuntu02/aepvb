"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import type { GalleryRow } from "@/lib/db/schema";

interface Props {
  initialData?: GalleryRow;
}

interface Errors {
  src?: string;
  altFr?: string;
  altEn?: string;
}

const CATEGORIES = ["activités", "équipe", "événements", "terrain", "autre"];

export default function GalleryForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [src, setSrc] = useState(initialData?.src ?? "");
  const [altFr, setAltFr] = useState(initialData?.altFr ?? "");
  const [altEn, setAltEn] = useState(initialData?.altEn ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initialData;

  function validate(): boolean {
    const e: Errors = {};
    if (!src) e.src = "Une image est obligatoire";
    if (!altFr.trim()) e.altFr = adminFr.required + " — " + adminFr.imageAltRequired;
    if (!altEn.trim()) e.altEn = adminFr.required + " — " + adminFr.imageAltRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        src,
        altFr: altFr.trim(),
        altEn: altEn.trim(),
        category: category || null,
        date: date || null,
      };

      const url = isEdit ? `/api/admin/gallery/${initialData.id}` : "/api/admin/gallery";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) {
        const d = await res.json();
        toast(d.error ?? adminFr.error, "error");
        return;
      }

      toast(adminFr.success);
      router.push("/admin/gallery");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/gallery");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  const hasImage = !!src;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.galleryEdit : adminFr.galleryNew}
          </h2>
          {isEdit && (
            <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              {adminFr.delete}
            </Button>
          )}
        </div>

        <div>
          <ImageUpload
            currentSrc={src}
            onUploaded={setSrc}
            onRemove={() => setSrc("")}
            contentType="gallery"
            label={`${adminFr.fieldImage} *`}
          />
          {errors.src && <p role="alert" className="text-xs text-red-600 mt-1">{errors.src}</p>}
        </div>

        {/* Alt text — required when image is present */}
        {hasImage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            {adminFr.imageAltRequired}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🇫🇷 {adminFr.fieldAltFr} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={altFr} onChange={(e) => setAltFr(e.target.value)} aria-required aria-invalid={!!errors.altFr} />
          {errors.altFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.altFr}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🇬🇧 {adminFr.fieldAltEn} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={altEn} onChange={(e) => setAltEn(e.target.value)} aria-required aria-invalid={!!errors.altEn} />
          {errors.altEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.altEn}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldCategory}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">— Aucune —</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldDate}</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/gallery")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
