"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Outfit } from "@/lib/types";

interface OutfitFormProps {
  outfit?: Outfit;
  onSubmit: (
    data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function OutfitForm({
  outfit,
  onSubmit,
  onCancel,
  isSubmitting,
}: OutfitFormProps) {
  const [formData, setFormData] = useState({
    name: outfit?.name || "",
    description: outfit?.description || "",
    clothingItemIds: outfit?.clothingItemIds || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Clothing Items
        </label>
        <div className="p-4 border rounded-md">
          <p className="text-sm text-muted-foreground">
            No items selected. Click "Add Items" to select clothing items for
            this outfit.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => {
              // TODO: Implement item selection
              console.log("Open item selection");
            }}
          >
            Add Items
          </Button>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : outfit
            ? "Update Outfit"
            : "Create Outfit"}
        </Button>
      </div>
    </form>
  );
}
