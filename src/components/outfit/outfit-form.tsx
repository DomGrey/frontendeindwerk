"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Outfit } from "@/lib/types";
import { ClothingItem } from "@/lib/types";
import { getClothingItems } from "@/lib/api/clothing";
import { useAuth } from "@/lib/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

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
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: outfit?.name || "",
    description: outfit?.description || "",
    clothingItemIds: outfit?.clothingItemIds || [],
  });
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [availableItems, setAvailableItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available clothing items
  useEffect(() => {
    const loadItems = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const items = await getClothingItems(token);
        setAvailableItems(
          items.map((item: ApiClothingItem) => ({
            id: item.id,
            name: item.name,
            size: item.size,
            imageUrl: item.image_url || "",
            category: item.category,
            color: item.color,
            brand: item.brand,
            userId: item.user_id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }))
        );
      } catch (error) {
        console.error("Failed to load clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [token]);

  // Update selected items when formData.clothingItemIds changes
  useEffect(() => {
    const items = availableItems.filter((item) =>
      formData.clothingItemIds.includes(item.id)
    );
    setSelectedItems(items);
  }, [formData.clothingItemIds, availableItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleItemToggle = (item: ClothingItem) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    if (isSelected) {
      // Remove item
      const newSelectedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );
      setSelectedItems(newSelectedItems);
      setFormData((prev) => ({
        ...prev,
        clothingItemIds: newSelectedItems.map((item) => item.id),
      }));
    } else {
      // Add item
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      setFormData((prev) => ({
        ...prev,
        clothingItemIds: newSelectedItems.map((item) => item.id),
      }));
    }
  };

  const removeItem = (itemId: number) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newSelectedItems);
    setFormData((prev) => ({
      ...prev,
      clothingItemIds: newSelectedItems.map((item) => item.id),
    }));
  };

  return (
    <>
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
            Clothing Items ({selectedItems.length} selected)
          </label>
          <div className="p-4 border rounded-md">
            {selectedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items selected. Click "Add Items" to select clothing items
                for this outfit.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-background rounded border flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            📷
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({item.category})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => setShowItemSelector(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Items"}
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

      {/* Clothing Item Selection Dialog */}
      <Dialog open={showItemSelector} onOpenChange={setShowItemSelector}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Clothing Items</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {availableItems.map((item) => {
              const isSelected = selectedItems.some(
                (selected) => selected.id === item.id
              );
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleItemToggle(item)}
                >
                  <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-lg text-muted-foreground">📷</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.brand && `${item.brand} • `}
                      {item.category} • {item.color} • {item.size}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowItemSelector(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
