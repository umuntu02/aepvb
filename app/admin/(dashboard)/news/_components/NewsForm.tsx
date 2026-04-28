"use client";

import { useState, useCallback } from "react";
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
import type { News } from "@/lib/db/schema";

interface Props {
  initialData?: News;
}

interface Errors {
  titleFr?: string;
  category?: string;
  author?: string;
  slug?: string;
}

export default function NewsForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [titleFr, setTitleFr] = useState(initialData?.titleFr ?? "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerptFr, setExcerptFr] = useState(initialData?.excerptFr ?? "");
  const [excerptEn, setExcerptEn] = useState(initialData?.excerptEn ?? "");
  const [contentFr, setContentFr] = useState(initialData?.contentFr ?? "");
  const [contentEn, setContentEn] = useState(initialData?.contentEn ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "AEPVB");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [published, setPublished] = useState(initialData?.published ?? true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initialData;

  function validate(): boolean {
    const e: Errors = {};
    if (!titleFr.trim()) e.titleFr = adminFr.required;
    if (!category.trim()) e.category = adminFr.required;
    if (!author.trim()) e.author = adminFr.required;
    if (!slug.trim()) e.slug = adminFr.required;
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
        excerptFr: excerptFr.trim() || null,
        excerptEn: excerptEn.trim() || null,
        contentFr: contentFr.trim() || null,
        contentEn: contentEn.trim() || null,
        date: date || null,
        category: category.trim(),
        author: author.trim(),
        image: image || null,
        featured,
        published,
      };

      const url = isEdit ? `/api/admin/news/${initialData.id}` : "/api/admin/news";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        toast(data.error ?? adminFr.error, "error");
        return;
      }

      toast(adminFr.success);
      router.push("/admin/news");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/news/${initialData!.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast(adminFr.error, "error");
        return;
      }
      toast("Supprimé ✓");
      router.push("/admin/news");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  const EXCERPT_MAX = 300;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.newsEdit : adminFr.newsNew}
          </h2>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowDelete(true)}
            >
              {adminFr.delete}
            </Button>
          )}
        </div>

        {/* Titre bilingue */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇫🇷 {adminFr.fieldTitleFr}{" "}
              <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              aria-required
              aria-invalid={!!errors.titleFr}
            />
            {errors.titleFr && (
              <p role="alert" className="text-xs text-red-600 mt-1">{errors.titleFr}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇬🇧 {adminFr.fieldTitleEn}
            </label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
        </div>

        {/* Slug */}
        <SlugInput
          value={slug}
          onChange={setSlug}
          sourceText={titleFr}
          error={errors.slug}
          required
        />

        {/* Extrait bilingue */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇫🇷 {adminFr.fieldExcerptFr}
            </label>
            <Textarea
              value={excerptFr}
              onChange={(e) => setExcerptFr(e.target.value.slice(0, EXCERPT_MAX))}
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1">
              {excerptFr.length}/{EXCERPT_MAX}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇬🇧 {adminFr.fieldExcerptEn}
            </label>
            <Textarea
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value.slice(0, EXCERPT_MAX))}
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1">
              {excerptEn.length}/{EXCERPT_MAX}
            </p>
          </div>
        </div>

        {/* Contenu bilingue */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇫🇷 {adminFr.fieldContentFr}
            </label>
            <Textarea
              value={contentFr}
              onChange={(e) => setContentFr(e.target.value)}
              rows={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇬🇧 {adminFr.fieldContentEn}
            </label>
            <Textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={8}
            />
          </div>
        </div>

        {/* Métadonnées */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldDate}
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldCategory}{" "}
              <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-required
              aria-invalid={!!errors.category}
            />
            {errors.category && (
              <p role="alert" className="text-xs text-red-600 mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.fieldAuthor}{" "}
              <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              aria-required
              aria-invalid={!!errors.author}
            />
            {errors.author && (
              <p role="alert" className="text-xs text-red-600 mt-1">{errors.author}</p>
            )}
          </div>
        </div>

        {/* Image */}
        <ImageUpload
          currentSrc={image}
          onUploaded={setImage}
          onRemove={() => setImage("")}
          contentType="news"
          label={adminFr.fieldImage}
        />

        {/* Toggles */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Checkbox
              checked={featured}
              onCheckedChange={(v) => setFeatured(v === true)}
              id="featured"
            />
            <span>{adminFr.fieldFeatured}</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Checkbox
              checked={published}
              onCheckedChange={(v) => setPublished(v === true)}
              id="published"
            />
            <span>{adminFr.togglePublished}</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? adminFr.saving : adminFr.save}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/news")}
            disabled={loading}
          >
            {adminFr.cancel}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />

      {isEdit && initialData.slug && (
        <AlbumSection
          contentType="news"
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
