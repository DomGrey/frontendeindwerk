"use client";

import { Outfit } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OutfitForm } from "./outfit-form";

interface OutfitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outfit?: Outfit;
  onSubmit: (
    data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  isSubmitting?: boolean;
}

export function OutfitDialog({
  open,
  onOpenChange,
  outfit,
  onSubmit,
  isSubmitting,
}: OutfitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{outfit ? "Edit Outfit" : "Create Outfit"}</DialogTitle>
          <DialogDescription>
            {outfit
              ? "Update your outfit details below."
              : "Create a new outfit by filling out the form below."}
          </DialogDescription>
        </DialogHeader>
        <OutfitForm
          outfit={outfit}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
