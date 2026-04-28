"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";
import { X, Upload, ImageIcon } from "lucide-react";

const CATEGORIES = ["activités", "équipe", "événements", "terrain", "autre"];
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Status = "pending" | "uploading" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  preview: string;
  altFr: string;
  altEn: string;
  category: string;
  status: Status;
  error?: string;
}

export default function NewGalleryPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const items: QueueItem[] = [];

    for (const file of arr) {
      if (!VALID_TYPES.includes(file.type)) {
        toast(adminFr.galleryMultiInvalidType, "error");
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast(adminFr.galleryMultiFileTooLarge, "error");
        continue;
      }
      const preview = URL.createObjectURL(file);
      items.push({
        id: crypto.randomUUID(),
        file,
        preview,
        altFr: "",
        altEn: "",
        category: CATEGORIES[0],
        status: "pending",
      });
    }

    setQueue((prev) => [...prev, ...items]);
  }, [toast]);

  function removeItem(id: string) {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    queue.forEach((item) => URL.revokeObjectURL(item.preview));
    setQueue([]);
  }

  async function uploadItem(item: QueueItem): Promise<boolean> {
    updateItem(item.id, { status: "uploading" });

    try {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("contentType", "gallery");

      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (uploadRes.status === 401) {
        router.push("/admin/login");
        return false;
      }
      if (!uploadRes.ok) {
        const d = await uploadRes.json();
        updateItem(item.id, { status: "error", error: d.error ?? adminFr.galleryMultiError });
        return false;
      }

      const { path } = await uploadRes.json();

      const galleryRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: path, altFr: item.altFr, altEn: item.altEn, category: item.category }),
      });
      if (!galleryRes.ok) {
        const d = await galleryRes.json();
        updateItem(item.id, { status: "error", error: d.error ?? adminFr.galleryMultiError });
        return false;
      }

      updateItem(item.id, { status: "done" });
      return true;
    } catch {
      updateItem(item.id, { status: "error", error: adminFr.galleryMultiError });
      return false;
    }
  }

  async function handleSubmit() {
    const pending = queue.filter((i) => i.status === "pending" || i.status === "error");
    if (pending.length === 0) return;

    if (pending.some((i) => !i.altFr.trim())) {
      toast(adminFr.imageAltRequired, "error");
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const item of pending) {
      const ok = await uploadItem(item);
      if (ok) successCount++;
    }

    setUploading(false);

    if (successCount > 0) {
      toast(adminFr.galleryMultiSuccess(successCount));
      router.push("/admin/gallery");
    }
  }

  const pendingCount = queue.filter((i) => i.status === "pending" || i.status === "error").length;

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{adminFr.galleryNew}</h2>
      </div>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={adminFr.galleryMultiDropzone}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors select-none ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">{adminFr.galleryMultiDropzone}</p>
        <p className="text-xs text-gray-400 mt-1">{adminFr.galleryMultiHint}</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {/* Queue */}
      {queue.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{queue.length} fichier{queue.length > 1 ? "s" : ""}</p>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={uploading}>
              {adminFr.galleryMultiClearAll}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {queue.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg bg-white">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-gray-100">
                  {item.preview ? (
                    <Image src={item.preview} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <ImageIcon className="m-auto h-6 w-6 text-gray-400" />
                  )}
                  {/* Status overlay */}
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs">{adminFr.imageUploading}</span>
                    </div>
                  )}
                  {item.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/60 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}
                  {item.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✗</span>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        value={item.altFr}
                        onChange={(e) => updateItem(item.id, { altFr: e.target.value })}
                        placeholder={adminFr.galleryMultiAltFrPlaceholder}
                        disabled={item.status === "uploading" || item.status === "done"}
                        aria-label={adminFr.galleryMultiAltFrPlaceholder}
                        className="text-sm"
                      />
                      {item.status !== "done" && !item.altFr.trim() && (
                        <p className="text-xs text-red-500 mt-0.5">{adminFr.required}</p>
                      )}
                    </div>
                    <Input
                      value={item.altEn}
                      onChange={(e) => updateItem(item.id, { altEn: e.target.value })}
                      placeholder={adminFr.galleryMultiAltEnPlaceholder}
                      disabled={item.status === "uploading" || item.status === "done"}
                      aria-label={adminFr.galleryMultiAltEnPlaceholder}
                      className="text-sm"
                    />
                  </div>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    disabled={item.status === "uploading" || item.status === "done"}
                    className="text-sm border border-input rounded-md px-3 py-1.5 bg-background"
                    aria-label={adminFr.fieldCategory}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {item.error && (
                    <p className="text-xs text-red-600">{item.error}</p>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={item.status === "uploading"}
                  className="shrink-0 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label={adminFr.delete}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || pendingCount === 0}
            >
              {uploading
                ? adminFr.imageUploading
                : adminFr.galleryMultiSubmit(pendingCount)}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/gallery")}
              disabled={uploading}
            >
              {adminFr.cancel}
            </Button>
          </div>
        </>
      )}

      {queue.length === 0 && (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/gallery")}
          >
            {adminFr.cancel}
          </Button>
        </div>
      )}
    </div>
  );
}
