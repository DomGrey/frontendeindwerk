"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClothingItem } from "@/lib/types";

interface ClothingItemFormProps {
  item?: ClothingItem;
  onSubmit: (
    data: Omit<ClothingItem, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  color?: string;
  size?: string;
}

export function ClothingItemForm({
  item,
  onSubmit,
  onCancel,
}: ClothingItemFormProps) {
  const [formData, setFormData] = useState<
    Omit<ClothingItem, "id" | "userId" | "createdAt" | "updatedAt">
  >({
    name: item?.name || "",
    category: item?.category || "",
    color: item?.color || "",
    brand: item?.brand || "",
    size: item?.size || "",
    imageUrl: item?.imageUrl || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.color?.trim()) {
      newErrors.color = "Color is required";
    }

    if (!formData.size?.trim()) {
      newErrors.size = "Size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name}</span>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
          className={errors.category ? "border-red-500" : ""}
        />
        {errors.category && (
          <span className="text-sm text-red-500">{errors.category}</span>
        )}
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
          className={errors.color ? "border-red-500" : ""}
        />
        {errors.color && (
          <span className="text-sm text-red-500">{errors.color}</span>
        )}
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          value={formData.brand || ""}
          onChange={handleChange}
          placeholder="Enter brand"
        />
      </div>

      <div>
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Enter size"
          className={errors.size ? "border-red-500" : ""}
        />
        {errors.size && (
          <span className="text-sm text-red-500">{errors.size}</span>
        )}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{item ? "Update Item" : "Add Item"}</Button>
      </div>
    </form>
  );
}
