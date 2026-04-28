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
import type { TestimonialRow } from "@/lib/db/schema";

interface Props { initialData?: TestimonialRow; }

export default function TestimonialForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();
  const isEdit = !!initialData;

  const [authorName, setAuthorName] = useState(initialData?.authorName ?? "");
  const [authorRoleFr, setAuthorRoleFr] = useState(initialData?.authorRoleFr ?? "");
  const [authorRoleEn, setAuthorRoleEn] = useState(initialData?.authorRoleEn ?? "");
  const [authorPhoto, setAuthorPhoto] = useState(initialData?.authorPhoto ?? "");
  const [contentFr, setContentFr] = useState(initialData?.contentFr ?? "");
  const [contentEn, setContentEn] = useState(initialData?.contentEn ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (initialData?.status as "draft" | "published") ?? "draft"
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!authorName.trim()) e.authorName = adminFr.required;
    if (!contentFr.trim()) e.contentFr = adminFr.required;
    if (!contentEn.trim()) e.contentEn = adminFr.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/sections/testimonials/${initialData.id}` : "/api/admin/sections/testimonials";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName, authorRoleFr: authorRoleFr || null, authorRoleEn: authorRoleEn || null,
          authorPhoto: authorPhoto || null, contentFr, contentEn, status,
        }),
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { const d = await res.json(); toast(d.error ?? adminFr.error, "error"); return; }
      toast(adminFr.success);
      router.push("/admin/sections/testimonials");
    } catch { toast(adminFr.error, "error"); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/sections/testimonials/${initialData!.id}`, { method: "DELETE" });
      toast("Supprimé ✓");
      router.push("/admin/sections/testimonials");
    } catch { toast(adminFr.error, "error"); }
    finally { setDeleting(false); setShowDelete(false); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.testimonialsEdit : adminFr.testimonialsNew}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${status === "draft" ? "text-amber-700" : "text-gray-400"}`}>{adminFr.statusToggleDraft}</span>
              <Switch checked={status === "published"} onCheckedChange={(v: boolean) => setStatus(v ? "published" : "draft")} aria-label="Publier ce témoignage" />
              <span className={`text-xs font-medium ${status === "published" ? "text-green-700" : "text-gray-400"}`}>{adminFr.statusTogglePublished}</span>
            </div>
            {isEdit && <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>{adminFr.delete}</Button>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.testimonialsFieldAuthorName} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} aria-required aria-invalid={!!errors.authorName} />
          {errors.authorName && <p role="alert" className="text-xs text-red-600 mt-1">{errors.authorName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.testimonialsFieldRoleFr}</label>
            <Input value={authorRoleFr} onChange={(e) => setAuthorRoleFr(e.target.value)} placeholder="Parent d'élève" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.testimonialsFieldRoleEn}</label>
            <Input value={authorRoleEn} onChange={(e) => setAuthorRoleEn(e.target.value)} placeholder="Parent" />
          </div>
        </div>

        <ImageUpload
          currentSrc={authorPhoto}
          onUploaded={setAuthorPhoto}
          onRemove={() => setAuthorPhoto("")}
          contentType="testimonials"
          label={adminFr.testimonialsFieldPhoto}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.testimonialsFieldContentFr} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Textarea
            value={contentFr}
            onChange={(e) => setContentFr(e.target.value)}
            rows={4}
            aria-required
            aria-invalid={!!errors.contentFr}
          />
          {errors.contentFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.contentFr}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.testimonialsFieldContentEn} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            rows={4}
            aria-required
            aria-invalid={!!errors.contentEn}
          />
          {errors.contentEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.contentEn}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/sections/testimonials")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>
      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
