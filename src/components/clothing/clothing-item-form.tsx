"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotoUpload } from "@/components/ui/photo-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ClothingItem, ClothingItemOptions } from "@/lib/types/api";
import { useAuth } from "@/lib/context/auth-context";
import { getClothingItemOptions } from "@/lib/api/clothing";

const clothingItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  color: z.string().min(1, "Color is required"),
  brand: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  season: z.string().min(1, "Season is required"),
  description: z.string().optional(),
});

type ClothingItemFormData = z.infer<typeof clothingItemSchema>;

interface ClothingItemFormProps {
  item?: ClothingItem;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const colors = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Brown",
  "Orange",
  "Beige",
  "Navy",
  "Burgundy",
  "Teal",
  "Coral",
  "Lavender",
  "Olive",
  "Maroon",
  "Cream",
];

export function ClothingItemForm({
  item,
  onSubmit,
  onCancel,
  isSubmitting,
}: ClothingItemFormProps) {
  const { token } = useAuth();
  const [image, setImage] = useState<File | string | null>(
    item?.image_url || null
  );
  const [careLabel, setCareLabel] = useState<File | string | null>(null);
  const [options, setOptions] = useState<ClothingItemOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const form = useForm<ClothingItemFormData>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      color: item?.color || "",
      brand: item?.brand || "",
      size: item?.size || "",
      season: item?.season || "All-Year",
      description: "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        color: item.color,
        brand: item.brand || "",
        size: item.size,
        season: item.season || "All-Year",
        description: "",
      });
      setImage(item.image_url || null);
    }
  }, [item, form]);

  useEffect(() => {
    if (!token) return;
    setOptionsLoading(true);
    setOptionsError(null);
    getClothingItemOptions(token)
      .then((opts) => setOptions(opts))
      .catch((err) => setOptionsError("Failed to load options"))
      .finally(() => setOptionsLoading(false));
  }, [token]);

  const handleSubmit = (data: ClothingItemFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("color", data.color);
    formData.append("size", data.size);
    formData.append("season", data.season);
    if (data.brand) formData.append("brand", data.brand);
    if (data.description) formData.append("description", data.description);

    if (image instanceof File) {
      formData.append("image", image);
    }
    if (careLabel instanceof File) {
      formData.append("care_label", careLabel);
    }

    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 gap-4">
          <PhotoUpload label="Item Image" value={image} onChange={setImage} />
          <PhotoUpload
            label="Care Label"
            value={careLabel}
            onChange={setCareLabel}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Blue T-Shirt"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionsLoading ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : optionsError ? (
                    <SelectItem value="__error__" disabled>
                      Error loading options
                    </SelectItem>
                  ) : (
                    options?.categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Nike" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionsLoading ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : optionsError ? (
                    <SelectItem value="__error__" disabled>
                      Error loading options
                    </SelectItem>
                  ) : (
                    options?.seasons.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season === "all-year"
                          ? "All Year"
                          : season.charAt(0).toUpperCase() + season.slice(1)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionsLoading ? (
                    <SelectItem value="__loading__" disabled>
                      Loading...
                    </SelectItem>
                  ) : optionsError ? (
                    <SelectItem value="__error__" disabled>
                      Error loading options
                    </SelectItem>
                  ) : (
                    options?.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                  placeholder="Add any additional details about this item..."
                  className="min-h-[80px]"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {isSubmitting ? "Saving..." : item ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
