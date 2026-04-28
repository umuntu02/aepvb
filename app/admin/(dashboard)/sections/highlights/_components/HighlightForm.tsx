"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/app/admin/_components/ConfirmDialog";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import type { HighlightRow } from "@/lib/db/schema";
import * as LucideIcons from "lucide-react";

// DECISION: curated subset of Lucide icons shown as quick-pick swatches.
// Admin can also type any Lucide icon name directly in the text field.
const ICON_PRESETS = [
  "Users", "Heart", "Home", "Star", "BookOpen", "Handshake",
  "Calendar", "BarChart3", "TrendingUp", "Globe", "Award", "Shield",
  "Smile", "Target", "Leaf", "Sun", "Lightbulb", "MessageCircle",
  "CheckCircle", "Gift",
];

function IconSwatch({ name, selected, onClick }: { name: string; selected: boolean; onClick: () => void }) {
  const Ic = (LucideIcons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string; "aria-hidden"?: boolean }> | undefined;
  if (!Ic) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      aria-pressed={selected}
      className={`p-2 rounded-lg border transition-colors ${
        selected
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-500"
      }`}
    >
      <Ic className="h-5 w-5" aria-hidden />
    </button>
  );
}

interface Props { initialData?: HighlightRow; }

export default function HighlightForm({ initialData }: Props) {
  const router = useRouter();
  const toast = useAdminToast();
  const isEdit = !!initialData;

  const [icon, setIcon] = useState(initialData?.icon ?? "");
  const [valueFr, setValueFr] = useState(initialData?.valueFr ?? "");
  const [valueEn, setValueEn] = useState(initialData?.valueEn ?? "");
  const [labelFr, setLabelFr] = useState(initialData?.labelFr ?? "");
  const [labelEn, setLabelEn] = useState(initialData?.labelEn ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    (initialData?.status as "draft" | "published") ?? "draft"
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!valueFr.trim()) e.valueFr = adminFr.required;
    if (!valueEn.trim()) e.valueEn = adminFr.required;
    if (!labelFr.trim()) e.labelFr = adminFr.required;
    if (!labelEn.trim()) e.labelEn = adminFr.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/sections/highlights/${initialData.id}` : "/api/admin/sections/highlights";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon: icon || null, valueFr, valueEn, labelFr, labelEn, status }),
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) { const d = await res.json(); toast(d.error ?? adminFr.error, "error"); return; }
      toast(adminFr.success);
      router.push("/admin/sections/highlights");
    } catch { toast(adminFr.error, "error"); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/sections/highlights/${initialData!.id}`, { method: "DELETE" });
      toast("Supprimé ✓");
      router.push("/admin/sections/highlights");
    } catch { toast(adminFr.error, "error"); }
    finally { setDeleting(false); setShowDelete(false); }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="max-w-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? adminFr.highlightsEdit : adminFr.highlightsNew}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${status === "draft" ? "text-amber-700" : "text-gray-400"}`}>{adminFr.statusToggleDraft}</span>
              <Switch checked={status === "published"} onCheckedChange={(v: boolean) => setStatus(v ? "published" : "draft")} aria-label="Publier ce chiffre clé" />
              <span className={`text-xs font-medium ${status === "published" ? "text-green-700" : "text-gray-400"}`}>{adminFr.statusTogglePublished}</span>
            </div>
            {isEdit && <Button type="button" variant="destructive" size="sm" onClick={() => setShowDelete(true)}>{adminFr.delete}</Button>}
          </div>
        </div>

        {/* Icon picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{adminFr.highlightsFieldIcon}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {ICON_PRESETS.map((name) => (
              <IconSwatch key={name} name={name} selected={icon === name} onClick={() => setIcon(name)} />
            ))}
          </div>
          <Input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Nom Lucide personnalisé — ex. TrendingUp"
            className="text-sm"
          />
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.highlightsFieldValueFr} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={valueFr} onChange={(e) => setValueFr(e.target.value)} placeholder="500+" aria-required aria-invalid={!!errors.valueFr} />
            {errors.valueFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.valueFr}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {adminFr.highlightsFieldValueEn} <span className="text-red-500" aria-hidden>*</span>
            </label>
            <Input value={valueEn} onChange={(e) => setValueEn(e.target.value)} placeholder="500+" aria-required aria-invalid={!!errors.valueEn} />
            {errors.valueEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.valueEn}</p>}
          </div>
        </div>

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.highlightsFieldLabelFr} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={labelFr} onChange={(e) => setLabelFr(e.target.value)} placeholder="Bénéficiaires aidés" aria-required aria-invalid={!!errors.labelFr} />
          {errors.labelFr && <p role="alert" className="text-xs text-red-600 mt-1">{errors.labelFr}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {adminFr.highlightsFieldLabelEn} <span className="text-red-500" aria-hidden>*</span>
          </label>
          <Input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} placeholder="People helped" aria-required aria-invalid={!!errors.labelEn} />
          {errors.labelEn && <p role="alert" className="text-xs text-red-600 mt-1">{errors.labelEn}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>{loading ? adminFr.saving : adminFr.save}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/sections/highlights")} disabled={loading}>{adminFr.cancel}</Button>
        </div>
      </form>
      <ConfirmDialog open={showDelete} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </>
  );
}
