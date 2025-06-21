"use client";

import { ClothingItem } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClothingItemForm } from "./clothing-item-form";

interface ClothingItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ClothingItem;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}

export function ClothingItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
  isSubmitting,
}: ClothingItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Clothing Item" : "Add New Clothing Item"}
          </DialogTitle>
        </DialogHeader>
        <ClothingItemForm
          item={item}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
