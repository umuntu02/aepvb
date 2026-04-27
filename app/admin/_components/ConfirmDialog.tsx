"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminFr } from "@/lib/i18n/admin-fr";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ open, onConfirm, onCancel, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adminFr.confirmTitle}</DialogTitle>
          <DialogDescription>{adminFr.confirmBody}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {adminFr.confirmNo}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Suppression…" : adminFr.confirmYes}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
