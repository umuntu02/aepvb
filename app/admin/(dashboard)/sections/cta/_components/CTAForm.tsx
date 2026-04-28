"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import { ExternalLink } from "lucide-react";
import type { CtaBlockRow } from "@/lib/db/schema";

interface Props { initialData?: CtaBlockRow; }

export default function CTAForm({ initialData }: Props) {
  const toast = useAdminToast();

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [subtitleFr, setSubtitleFr] = useState(initialData?.subtitleFr ?? "");
  const [subtitleEn, setSubtitleEn] = useState(initialData?.subtitleEn ?? "");
  const [buttonLabelFr, setButtonLabelFr] = useState(initialData?.buttonLabelFr ?? "");
  const [buttonLabelEn, setButtonLabelEn] = useState(initialData?.buttonLabelEn ?? "");
  const [buttonUrl, setButtonUrl] = useState(initialData?.buttonUrl ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (initialData?.status as "draft" | "published") ?? "published"
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!titleFr.trim()) e.titleFr = adminFr.required;
    if (!titleEn.trim()) e.titleEn = adminFr.required;
    if (!buttonLabelFr.trim()) e.buttonLabelFr = adminFr.required;
    if (!buttonLabelEn.trim()) e.buttonLabelEn = adminFr.required;
    if (!buttonUrl.trim()) e.buttonUrl = adminFr.required;
    else if (!/^https?:\/\/|^\//i.test(buttonUrl)) e.buttonUrl = adminFr.urlInvalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections/cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleFr, titleEn, subtitleFr: subtitleFr || null, subtitleEn: subtitleEn || null, buttonLabelFr, buttonLabelEn, buttonUrl, status }),
      });
      if (!res.ok) { const d = await res.json(); toast(d.error ?? adminFr.error, "error"); return; }
      toast(adminFr.success);
    } catch { toast(adminFr.error, "error"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{adminFr.ctaTitle}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{adminFr.ctaSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${status === "draft" ? "text-amber-700" : "text-gray-400"}`}>{adminFr.statusToggleDraft}</span>
          <Switch checked={status === "published"} onCheckedChange={(v: boolean) => setStatus(v ? "published" : "draft")} aria-label="Afficher le bloc CTA" />
          <span className={`text-xs font-medium ${status === "published" ? "text-green-700" : "text-gray-400"}`}>{adminFr.statusTogglePublished}</span>
        </div>
      </div>

      {status === "draft" && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="note">
          {adminFr.ctaHiddenWhenDraft}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {adminFr.ctaFieldTitleFr} <span className="text-red-500" aria-hidden>*</span>
        </label>
        <Input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} aria-required aria-invalid={!!errors.titleFr} />
        {errors.titleFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleFr}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {adminFr.ctaFieldTitleEn} <span className="text-red-500" aria-hidden>*</span>
        </label>
        <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} aria-required aria-invalid={!!errors.titleEn} />
        {errors.titleEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleEn}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.ctaFieldSubtitleFr}</label>
        <Textarea value={subtitleFr} onChange={(e) => setSubtitleFr(e.target.value)} rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.ctaFieldSubtitleEn}</label>
        <Textarea value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.ctaFieldButtonLabelFr} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={buttonLabelFr} onChange={(e) => setButtonLabelFr(e.target.value)} aria-required aria-invalid={!!errors.buttonLabelFr} />
          {errors.buttonLabelFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.buttonLabelFr}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.ctaFieldButtonLabelEn} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={buttonLabelEn} onChange={(e) => setButtonLabelEn(e.target.value)} aria-required aria-invalid={!!errors.buttonLabelEn} />
          {errors.buttonLabelEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.buttonLabelEn}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {adminFr.ctaFieldButtonUrl} <span className="text-red-500" aria-hidden>*</span>
        </label>
        <Input
          type="text"
          value={buttonUrl}
          onChange={(e) => setButtonUrl(e.target.value)}
          placeholder="/donate ou https://…"
          aria-required
          aria-invalid={!!errors.buttonUrl}
        />
        {errors.buttonUrl && <p role="alert" className="text-xs text-red-600 mt-1">{errors.buttonUrl}</p>}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          asChild
          className="ml-auto gap-1 text-blue-600"
        >
          <a href="/api/admin/preview?section=cta" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {adminFr.previewButton}
          </a>
        </Button>
      </div>
    </form>
  );
}
