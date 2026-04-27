"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import type { PartnerRow } from "@/lib/db/schema";

interface Props {
  initialData?: PartnerRow;
}

interface Errors {
  name?: string;
  website?: string;
}

export default function PartnerForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [name, setName] = useState(initialData?.name ?? "");
  const [logo, setLogo] = useState(initialData?.logo ?? "");
  const [website, setWebsite] = useState(initialData?.website ?? "");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initialData;

  function validate(): boolean {
    const e: Errors = {};
    if (!name.trim()) e.name = adminFr.required;
    if (website && !/^https?:\/\//i.test(website)) e.website = adminFr.urlInvalid;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        logo: logo || null,
        website: website.trim() || null,
      };

      const url = isEdit ? `/api/admin/partners/${initialData.id}` : "/api/admin/partners";
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
      router.push("/admin/partners");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/partners/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/partners");
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.partnersEdit : adminFr.partnersNew}
          </h2>
          {isEdit && (
            <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              {adminFr.delete}
            </Button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.fieldName} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} aria-required aria-invalid={!!errors.name} />
          {errors.name && <p role="alert" className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{adminFr.fieldWebsite}</label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://exemple.org"
            aria-invalid={!!errors.website}
          />
          {errors.website && <p role="alert" className="text-xs text-red-600 mt-1">{errors.website}</p>}
        </div>

        <ImageUpload currentSrc={logo} onUploaded={setLogo} onRemove={() => setLogo("")} contentType="partners" label={adminFr.fieldLogo} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/partners")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
