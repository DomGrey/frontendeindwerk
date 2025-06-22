"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

const outfitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type OutfitFormData = z.infer<typeof outfitSchema>;

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
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [availableItems, setAvailableItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<OutfitFormData>({
    resolver: zodResolver(outfitSchema),
    defaultValues: {
      name: outfit?.name || "",
      description: outfit?.description || "",
    },
  });

  useEffect(() => {
    if (outfit) {
      form.reset({
        name: outfit.name,
        description: outfit.description || "",
      });
      setSelectedItems([]);
    }
  }, [outfit, form]);

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

  const handleSubmit = (data: OutfitFormData) => {
    onSubmit({
      ...data,
      clothingItemIds: selectedItems.map((item) => item.id),
    });
  };

  const handleItemToggle = (item: ClothingItem) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );

    if (isSelected) {
      const newSelectedItems = selectedItems.filter(
        (selected) => selected.id !== item.id
      );
      setSelectedItems(newSelectedItems);
    } else {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
  };

  const removeItem = (itemId: number) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newSelectedItems);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Summer Casual Outfit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe this outfit..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>
              Clothing Items ({selectedItems.length} selected)
            </FormLabel>
            <Card>
              <CardContent className="p-4">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No items selected. Click "Add Items" to select clothing
                    items for this outfit.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-background rounded border flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                📷
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.color}
                              </Badge>
                            </div>
                          </div>
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
                  className="mt-3"
                  onClick={() => setShowItemSelector(true)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Add Items"}
                </Button>
              </CardContent>
            </Card>
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
      </Form>

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
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleItemToggle(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <span className="text-lg text-muted-foreground">
                            📷
                          </span>
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
                  </CardContent>
                </Card>
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
