"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminFr } from "@/lib/i18n/admin-fr";
import { useAdminToast } from "@/app/admin/(dashboard)/_components/AdminToastProvider";

interface AlbumPhoto {
  id: number;
  image: string;
  altFr: string;
  altEn: string;
  ordinal: number;
}

interface Props {
  contentType: "events" | "news";
  recordId: number;
  slug: string;
  defaultAltFr: string;
  defaultAltEn: string;
}

interface UploadItem {
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

function SortablePhotoCard({
  photo,
  onDelete,
  onEditAlt,
}: {
  photo: AlbumPhoto;
  onDelete: () => void;
  onEditAlt: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute top-1 left-1 z-10 cursor-grab bg-white/80 rounded p-1 touch-none"
        aria-label={adminFr.albumDragHandle}
      >
        <GripVertical className="h-3 w-3 text-gray-500" />
      </button>

      <div
        className="relative aspect-square cursor-pointer"
        onClick={onEditAlt}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEditAlt();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${adminFr.albumEditAlt}: ${photo.altFr}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.image}
          alt={photo.altFr}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-xs text-gray-500 truncate px-2 py-1">{photo.altFr}</p>

      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={adminFr.delete}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

export function AlbumSection({
  contentType,
  recordId,
  slug,
  defaultAltFr,
  defaultAltEn,
}: Props) {
  const toast = useAdminToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [editPhoto, setEditPhoto] = useState<AlbumPhoto | null>(null);
  const [deletePhotoId, setDeletePhotoId] = useState<number | null>(null);
  const [editAltFr, setEditAltFr] = useState("");
  const [editAltEn, setEditAltEn] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const apiBase = `/api/admin/albums/${contentType}/${recordId}/photos`;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch(apiBase);
      if (!res.ok) return;
      const data = await res.json();
      setPhotos(data);
    } catch {
      // fail silently — admin can retry
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function uploadFile(file: File) {
    const itemName = file.name;
    setUploadQueue((q) => [...q, { name: itemName, status: "uploading" }]);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("alt_fr", defaultAltFr || file.name);
      fd.append("alt_en", defaultAltEn || file.name);
      fd.append("slug", slug);

      const res = await fetch(apiBase, { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        setUploadQueue((q) =>
          q.map((i) =>
            i.name === itemName ? { ...i, status: "error", error: d.error } : i
          )
        );
        toast(d.error ?? adminFr.error, "error");
        return;
      }

      const photo: AlbumPhoto = await res.json();
      setPhotos((prev) => [...prev, photo]);
      setUploadQueue((q) =>
        q.map((i) => (i.name === itemName ? { ...i, status: "done" } : i))
      );
      setTimeout(
        () => setUploadQueue((q) => q.filter((i) => i.name !== itemName)),
        2000
      );
    } catch {
      setUploadQueue((q) =>
        q.map((i) => (i.name === itemName ? { ...i, status: "error" } : i))
      );
      toast(adminFr.error, "error");
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type)) {
        toast(`${file.name}: Format invalide (JPG, PNG, WEBP)`, "error");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast(`${file.name}: Trop volumineux (max 5 Mo)`, "error");
        continue;
      }
      await uploadFile(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) await handleFiles(e.dataTransfer.files);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(photos, oldIndex, newIndex);
    setPhotos(newOrder);

    try {
      await fetch(`/api/admin/albums/${contentType}/${recordId}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newOrder.map((p) => p.id) }),
      });
    } catch {
      setPhotos(photos);
      toast(adminFr.error, "error");
    }
  }

  function openEditAlt(photo: AlbumPhoto) {
    setEditPhoto(photo);
    setEditAltFr(photo.altFr);
    setEditAltEn(photo.altEn);
  }

  async function saveAlt() {
    if (!editPhoto) return;
    setSavingAlt(true);
    try {
      const res = await fetch(apiBase, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: editPhoto.id,
          altFr: editAltFr,
          altEn: editAltEn,
        }),
      });
      if (!res.ok) {
        toast(adminFr.error, "error");
        return;
      }
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editPhoto.id
            ? { ...p, altFr: editAltFr, altEn: editAltEn }
            : p
        )
      );
      setEditPhoto(null);
      toast(adminFr.success);
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setSavingAlt(false);
    }
  }

  async function confirmDelete() {
    if (!deletePhotoId) return;
    setDeleting(true);
    try {
      const res = await fetch(apiBase, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: deletePhotoId }),
      });
      if (!res.ok) {
        toast(adminFr.error, "error");
        return;
      }
      setPhotos((prev) => prev.filter((p) => p.id !== deletePhotoId));
      toast("Supprimé ✓");
    } catch {
      toast(adminFr.error, "error");
    } finally {
      setDeleting(false);
      setDeletePhotoId(null);
    }
  }

  const subtitle =
    contentType === "events"
      ? adminFr.albumSubtitleEvents
      : adminFr.albumSubtitleNews;

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        {adminFr.albumTitle}
      </h3>
      <p className="text-xs text-gray-500 mb-4">{subtitle}</p>

      {loading ? (
        <p className="text-sm text-gray-400">{adminFr.loading}</p>
      ) : (
        <>
          {/* Photo grid with DnD */}
          {photos.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={photos.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {photos.map((photo) => (
                    <SortablePhotoCard
                      key={photo.id}
                      photo={photo}
                      onDelete={() => setDeletePhotoId(photo.id)}
                      onEditAlt={() => openEditAlt(photo)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Upload zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
            aria-label={adminFr.albumUploadZone}
          >
            <p className="text-sm text-gray-500">{adminFr.albumUploadZone}</p>
            <p className="text-xs text-gray-400 mt-1">{adminFr.imageFormats}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            aria-label={adminFr.albumUploadZone}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              // Reset so the same file can be re-uploaded after deletion
              e.target.value = "";
            }}
          />

          {/* Per-file upload progress */}
          {uploadQueue.length > 0 && (
            <div className="mt-3 space-y-1">
              {uploadQueue.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="truncate flex-1">{item.name}</span>
                  {item.status === "uploading" && (
                    <span className="text-blue-500">{adminFr.albumUploading}</span>
                  )}
                  {item.status === "done" && (
                    <span className="text-green-500">✓</span>
                  )}
                  {item.status === "error" && (
                    <span className="text-red-500">{item.error ?? adminFr.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Alt text edit modal */}
      <Dialog open={!!editPhoto} onOpenChange={(v) => !v && setEditPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adminFr.albumEditAlt}</DialogTitle>
          </DialogHeader>
          {editPhoto && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🇫🇷 {adminFr.fieldAltFr}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </label>
                <Input
                  value={editAltFr}
                  onChange={(e) => setEditAltFr(e.target.value)}
                  aria-required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🇬🇧 {adminFr.fieldAltEn}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </label>
                <Input
                  value={editAltEn}
                  onChange={(e) => setEditAltEn(e.target.value)}
                  aria-required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditPhoto(null)}
                  disabled={savingAlt}
                >
                  {adminFr.cancel}
                </Button>
                <Button
                  onClick={saveAlt}
                  disabled={savingAlt || !editAltFr.trim() || !editAltEn.trim()}
                >
                  {savingAlt ? adminFr.saving : adminFr.save}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deletePhotoId}
        onOpenChange={(v) => !v && setDeletePhotoId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adminFr.confirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{adminFr.albumDeleteConfirm}</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeletePhotoId(null)}
              disabled={deleting}
            >
              {adminFr.confirmNo}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Suppression…" : adminFr.confirmYes}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
