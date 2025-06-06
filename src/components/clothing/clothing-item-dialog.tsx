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
  onSubmit: (
    data: Omit<ClothingItem, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
}

export function ClothingItemDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ClothingItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Clothing Item" : "Add Clothing Item"}
          </DialogTitle>
        </DialogHeader>
        <ClothingItemForm
          item={item}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
