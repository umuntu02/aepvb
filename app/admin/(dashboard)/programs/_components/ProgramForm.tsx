"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SlugInput } from "@/app/admin/_components/SlugInput";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import type { ProgramRow } from "@/lib/db/schema";

interface Props {
  initialData?: ProgramRow;
}

interface Errors {
  titleFr?: string;
  slug?: string;
  category?: string;
}

const CATEGORIES = [
  { value: "education", label: "Éducation" },
  { value: "health", label: "Santé" },
  { value: "economic", label: "Autonomisation économique" },
  { value: "environment", label: "Environnement" },
  { value: "peace", label: "Paix et droits" },
];

const STATUSES = [
  { value: "active", label: "Actif" },
  { value: "completed", label: "Terminé" },
  { value: "planned", label: "Planifié" },
];

export default function ProgramForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [descriptionFr, setDescriptionFr] = useState(initialData?.descriptionFr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn ?? "");
  const [fullDescriptionFr, setFullDescriptionFr] = useState(initialData?.fullDescriptionFr ?? "");
  const [fullDescriptionEn, setFullDescriptionEn] = useState(initialData?.fullDescriptionEn ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [published, setPublished] = useState(initialData?.published ?? true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initialData;

  function validate(): boolean {
    const e: Errors = {};
    if (!titleFr.trim()) e.titleFr = adminFr.required;
    if (!slug.trim()) e.slug = adminFr.required;
    if (!category) e.category = adminFr.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        titleFr: titleFr.trim(),
        titleEn: titleEn.trim() || null,
        slug: slug.trim(),
        descriptionFr: descriptionFr.trim(),
        descriptionEn: descriptionEn.trim(),
        fullDescriptionFr: fullDescriptionFr.trim(),
        fullDescriptionEn: fullDescriptionEn.trim(),
        category,
        image: image || "",
        startDate: startDate || null,
        status,
        published,
      };

      const url = isEdit ? `/api/admin/programs/${initialData.id}` : "/api/admin/programs";
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
      router.push("/admin/programs");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/programs/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/programs");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.programsEdit : adminFr.programsNew}
          </h2>
          {isEdit && (
            <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              {adminFr.delete}
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇫🇷 {adminFr.fieldTitleFr} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} aria-required aria-invalid={!!errors.titleFr} />
            {errors.titleFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleFr}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldTitleEn}</label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
        </div>

        <SlugInput value={slug} onChange={setSlug} sourceText={titleFr} error={errors.slug} required />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇫🇷 {adminFr.fieldDescFr}</label>
            <Textarea value={descriptionFr} onChange={(e) => setDescriptionFr(e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldDescEn}</label>
            <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇫🇷 {adminFr.fieldFullDescFr}</label>
            <Textarea value={fullDescriptionFr} onChange={(e) => setFullDescriptionFr(e.target.value)} rows={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldFullDescEn}</label>
            <Textarea value={fullDescriptionEn} onChange={(e) => setFullDescriptionEn(e.target.value)} rows={6} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldCategory} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-required
              aria-invalid={!!errors.category}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">— Sélectionner —</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {errors.category && <p role="alert" className="text-xs text-red-600 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldStatus}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldStartDate}</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        </div>

        <ImageUpload currentSrc={image} onUploaded={setImage} onRemove={() => setImage("")} contentType="programs" label={adminFr.fieldImage} />

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <Checkbox checked={published} onCheckedChange={(v) => setPublished(v === true)} id="published" />
          <span>{adminFr.togglePublished}</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/programs")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
