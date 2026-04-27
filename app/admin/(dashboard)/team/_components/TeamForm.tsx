"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/app/admin/_components/ImageUpload";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import type { TeamMemberRow } from "@/lib/db/schema";

interface Props {
  initialData?: TeamMemberRow;
}

interface Errors {
  name?: string;
  roleFr?: string;
}

export default function TeamForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();

  const [name, setName] = useState(initialData?.name ?? "");
  const [roleFr, setRoleFr] = useState(initialData?.roleFr ?? "");
  const [roleEn, setRoleEn] = useState(initialData?.roleEn ?? "");
  const [bioFr, setBioFr] = useState(initialData?.bioFr ?? "");
  const [bioEn, setBioEn] = useState(initialData?.bioEn ?? "");
  const [photo, setPhoto] = useState(initialData?.photo ?? "");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = !!initialData;

  function validate(): boolean {
    const e: Errors = {};
    if (!name.trim()) e.name = adminFr.required;
    if (!roleFr.trim()) e.roleFr = adminFr.required;
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
        roleFr: roleFr.trim(),
        roleEn: roleEn.trim() || null,
        bioFr: bioFr.trim(),
        bioEn: bioEn.trim(),
        photo: photo || null,
      };

      const url = isEdit ? `/api/admin/team/${initialData.id}` : "/api/admin/team";
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
      router.push("/admin/team");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) { toast(adminFr.error, "error"); return; }
      toast("Supprimé ✓");
      router.push("/admin/team");
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
            {isEdit ? adminFr.teamEdit : adminFr.teamNew}
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇫🇷 {adminFr.fieldRoleFr} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={roleFr} onChange={(e) => setRoleFr(e.target.value)} aria-required aria-invalid={!!errors.roleFr} />
            {errors.roleFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.roleFr}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldRoleEn}</label>
            <Input value={roleEn} onChange={(e) => setRoleEn(e.target.value)} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇫🇷 {adminFr.fieldBioFr}</label>
            <Textarea value={bioFr} onChange={(e) => setBioFr(e.target.value)} rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🇬🇧 {adminFr.fieldBioEn}</label>
            <Textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} rows={4} />
          </div>
        </div>

        <ImageUpload currentSrc={photo} onUploaded={setPhoto} onRemove={() => setPhoto("")} contentType="team" label={adminFr.fieldPhoto} />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/team")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>

      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
