"use client";

import type { Outfit } from "@/lib/types/api";
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
    data: Omit<
      Outfit,
      "id" | "user_id" | "created_at" | "updated_at" | "clothing_items"
    > & { clothing_item_ids: number[] }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {outfit ? "Edit Outfit" : "Create New Outfit"}
          </DialogTitle>
          <DialogDescription>
            {outfit
              ? "Update the details of your outfit."
              : "Create a new outfit by selecting clothing items."}
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
