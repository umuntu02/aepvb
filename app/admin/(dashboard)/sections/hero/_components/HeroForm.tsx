"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import { ExternalLink } from "lucide-react";
import type { HeroSlideRow } from "@/lib/db/schema";

interface Props {
  initialData?: HeroSlideRow;
}

export default function HeroForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();
  const isEdit = !!initialData;

  const [image, setImage] = useState(initialData?.image ?? "");
  const [altFr, setAltFr] = useState(initialData?.altFr ?? "");
  const [altEn, setAltEn] = useState(initialData?.altEn ?? "");
  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [subtitleFr, setSubtitleFr] = useState(initialData?.subtitleFr ?? "");
  const [subtitleEn, setSubtitleEn] = useState(initialData?.subtitleEn ?? "");
  const [ctaLabelFr, setCtaLabelFr] = useState(initialData?.ctaLabelFr ?? "");
  const [ctaLabelEn, setCtaLabelEn] = useState(initialData?.ctaLabelEn ?? "");
  const [ctaUrl, setCtaUrl] = useState(initialData?.ctaUrl ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (initialData?.status as "draft" | "published") ?? "draft"
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!image) e.image = adminFr.required;
    if (!altFr.trim()) e.altFr = adminFr.required;
    if (!altEn.trim()) e.altEn = adminFr.required;
    if (!titleFr.trim()) e.titleFr = adminFr.required;
    if (!titleEn.trim()) e.titleEn = adminFr.required;
    if (ctaUrl && !/^https?:\/\/|^\//i.test(ctaUrl)) e.ctaUrl = adminFr.urlInvalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        image, altFr, altEn, titleFr, titleEn,
        subtitleFr: subtitleFr || null,
        subtitleEn: subtitleEn || null,
        ctaLabelFr: ctaLabelFr || null,
        ctaLabelEn: ctaLabelEn || null,
        ctaUrl: ctaUrl || null,
        status,
      };
      const url = isEdit
        ? `/api/admin/sections/hero/${initialData.id}`
        : "/api/admin/sections/hero";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { const d = await res.json(); toast(d.error ?? adminFr.error, "error"); return; }
      toast(adminFr.success);
      router.push("/admin/sections/hero");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sections/hero/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/sections/hero");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">
        {/* Header + status toggle + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.heroEdit : adminFr.heroNew}
          </h2>
          <div className="flex items-center gap-6">
            {/* Status toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${status === "draft" ? "text-amber-700" : "text-gray-400"}`}>
                {adminFr.statusToggleDraft}
              </span>
              <Switch
                checked={status === "published"}
                onCheckedChange={(v: boolean) => setStatus(v ? "published" : "draft")}
                aria-label="Publier ce slide"
              />
              <span className={`text-xs font-medium ${status === "published" ? "text-green-700" : "text-gray-400"}`}>
                {adminFr.statusTogglePublished}
              </span>
            </div>
            {isEdit && (
              <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
                {adminFr.delete}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 -mt-4">
          {status === "published" ? adminFr.statusPublishedHelp : adminFr.statusDraftHelp}
        </p>

        {/* Image */}
        <div>
          <ImageUpload
            currentSrc={image}
            onUploaded={setImage}
            onRemove={() => setImage("")}
            contentType="hero"
            label={adminFr.fieldImage}
          />
          {errors.image && <p role="alert" className="text-xs text-red-600 mt-1">{errors.image}</p>}
        </div>

        {/* Alt text */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.heroFieldAltFr} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={altFr} onChange={(e) => setAltFr(e.target.value)} aria-required aria-invalid={!!errors.altFr} />
            {errors.altFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.altFr}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.heroFieldAltEn} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={altEn} onChange={(e) => setAltEn(e.target.value)} aria-required aria-invalid={!!errors.altEn} />
            {errors.altEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.altEn}</p>}
          </div>
        </div>

        {/* Titles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.heroFieldTitleFr} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} aria-required aria-invalid={!!errors.titleFr} />
          {errors.titleFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleFr}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.heroFieldTitleEn} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} aria-required aria-invalid={!!errors.titleEn} />
          {errors.titleEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleEn}</p>}
        </div>

        {/* Subtitles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.heroFieldSubtitleFr}</label>
          <Input value={subtitleFr} onChange={(e) => setSubtitleFr(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.heroFieldSubtitleEn}</label>
          <Input value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} />
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.heroFieldCtaLabelFr}</label>
            <Input value={ctaLabelFr} onChange={(e) => setCtaLabelFr(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.heroFieldCtaLabelEn}</label>
            <Input value={ctaLabelEn} onChange={(e) => setCtaLabelEn(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.heroFieldCtaUrl}</label>
          <Input
            type="text"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="/donate ou https://…"
            aria-invalid={!!errors.ctaUrl}
          />
          {errors.ctaUrl && <p role="alert" className="text-xs text-red-600 mt-1">{errors.ctaUrl}</p>}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/sections/hero")} disabled={loading}>
            {adminFr.cancel}
          </Button>
          {isEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="ml-auto gap-1 text-blue-600"
            >
              <a href={`/api/admin/preview?section=hero`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                {adminFr.previewButton}
              </a>
            </Button>
          )}
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
