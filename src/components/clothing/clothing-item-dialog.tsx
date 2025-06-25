"use client";

import { useEffect } from "react";
import type { ClothingItem } from "@/lib/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClothingItemForm } from "./clothing-item-form";
import { addToRecentlyViewed } from "@/lib/utils";

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
  useEffect(() => {
    if (open && item) {
      addToRecentlyViewed(item);
    }
  }, [open, item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Clothing Item" : "Add New Clothing Item"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Update the details of your clothing item."
              : "Add a new item to Your Closet."}
          </DialogDescription>
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
