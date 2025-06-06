"use client";

import { Outfit } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OutfitForm } from "./outfit-form";

interface OutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit?: Outfit;
  onSubmit: (
    data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
}

export function OutfitDialog({
  open,
  onOpenChange,
  outfit,
  onSubmit,
}: OutfitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{outfit ? "Edit Outfit" : "Create Outfit"}</DialogTitle>
        </DialogHeader>
        <OutfitForm
          outfit={outfit}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
