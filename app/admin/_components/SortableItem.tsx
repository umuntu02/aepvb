"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Props {
  id: number;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab text-gray-300 hover:text-gray-500 p-1 shrink-0 touch-none"
        aria-label="Réordonner"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}
