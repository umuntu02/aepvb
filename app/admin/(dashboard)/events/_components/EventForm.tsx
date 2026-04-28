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
import { AlbumSection } from "@/app/admin/_components/AlbumSection";
import type { EventRow } from "@/lib/db/schema";

interface Props {
  initialData?: EventRow;
}

interface Errors {
  titleFr?: string;
  slug?: string;
  date?: string;
  type?: string;
}

const EVENT_TYPES = ["conférence", "atelier", "cérémonie", "collecte", "formation", "autre"];

export default function EventForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [descriptionFr, setDescriptionFr] = useState(initialData?.descriptionFr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn ?? "");
  const [locationFr, setLocationFr] = useState(initialData?.locationFr ?? "");
  const [locationEn, setLocationEn] = useState(initialData?.locationEn ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [time, setTime] = useState(initialData?.time ?? "");
  const [type, setType] = useState(initialData?.type ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [registrationRequired, setRegistrationRequired] = useState(
    initialData?.registrationRequired ?? false
  );
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
    if (!date) e.date = adminFr.required;
    if (!type.trim()) e.type = adminFr.required;
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
        locationFr: locationFr.trim(),
        locationEn: locationEn.trim(),
        date,
        time: time || null,
        type: type.trim(),
        image: image || null,
        registrationRequired,
        published,
      };

      const url = isEdit
        ? `/api/admin/events/${initialData.id}`
        : "/api/admin/events";
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
      router.push("/admin/events");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/events");
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
            {isEdit ? adminFr.eventsEdit : adminFr.eventsNew}
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
            <Textarea value={descriptionFr} onChange={(e) => setDescriptionFr(e.target.value)} rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldDescEn}</label>
            <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={4} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇫🇷 {adminFr.fieldLocationFr}</label>
            <Input value={locationFr} onChange={(e) => setLocationFr(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldLocationEn}</label>
            <Input value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldDate} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-required aria-invalid={!!errors.date} />
            {errors.date && <p role="alert" className="text-xs text-red-600 mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldTime}</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldType} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-required
              aria-invalid={!!errors.type}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">— Sélectionner —</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.type && <p role="alert" className="text-xs text-red-600 mt-1">{errors.type}</p>}
          </div>
        </div>

        <ImageUpload currentSrc={image} onUploaded={setImage} onRemove={() => setImage("")} contentType="events" label={adminFr.fieldImage} />

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Checkbox checked={registrationRequired} onCheckedChange={(v) => setRegistrationRequired(v === true)} id="reg" />
            <span>{adminFr.fieldRegistration}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Checkbox checked={published} onCheckedChange={(v) => setPublished(v === true)} id="published" />
            <span>{adminFr.togglePublished}</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/events")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />

      {isEdit && initialData.slug && (
        <AlbumSection
          contentType="events"
          recordId={initialData.id}
          slug={initialData.slug}
          defaultAltFr={titleFr}
          defaultAltEn={titleEn}
        />
      )}

      {/* DECISION: album upload requires an existing record id — note shown in creation mode */}
      {!isEdit && (
        <p className="text-sm text-gray-500 mt-6 pt-6 border-t border-gray-200">
          {adminFr.albumSaveFirst}
        </p>
      )}
    </>
  );
}
