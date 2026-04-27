"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { adminFr } from "@/lib/i18n/admin-fr";

interface Props {
  currentSrc?: string;
  onUploaded: (path: string) => void;
  onRemove?: () => void;
  contentType: string;
  label?: string;
}

export function ImageUpload({
  currentSrc,
  onUploaded,
  onRemove,
  contentType,
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentSrc ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format invalide. Utilisez JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image dépasse la limite de 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("contentType", contentType);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Erreur lors du téléchargement");
      const { path } = await res.json();
      onUploaded(path);
    } catch {
      setError("Échec du téléchargement. Veuillez réessayer.");
      setPreview(currentSrc ?? "");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview("");
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      )}

      {preview ? (
        <div className="flex flex-col gap-2">
          <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs text-blue-600 hover:underline"
            >
              {uploading ? adminFr.imageUploading : adminFr.imageChange}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-xs text-red-600 hover:underline"
            >
              {adminFr.imageRemove}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-500 gap-1"
        >
          {uploading ? (
            adminFr.imageUploading
          ) : (
            <>
              <span>{adminFr.imageUpload}</span>
              <span className="text-xs text-gray-400">{adminFr.imageFormats}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label={adminFr.imageUpload}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
