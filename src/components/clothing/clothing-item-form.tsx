"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { ClothingItem } from "@/lib/types";

interface ClothingItemFormProps {
  item?: ClothingItem;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
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
  isSubmitting,
}: ClothingItemFormProps) {
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || "");
  const [color, setColor] = useState(item?.color || "");
  const [brand, setBrand] = useState(item?.brand || "");
  const [size, setSize] = useState(item?.size || "");
  const [image, setImage] = useState<File | string | null>(
    item?.imageUrl || null
  );
  const [careLabel, setCareLabel] = useState<File | string | null>(null); // Assuming no existing URL for care label

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setColor(item.color);
      setBrand(item.brand || "");
      setSize(item.size);
      setImage(item.imageUrl || null);
    }
  }, [item]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!color.trim()) newErrors.color = "Color is required";
    if (!size.trim()) newErrors.size = "Size is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("color", color);
      formData.append("size", size);
      if (brand) formData.append("brand", brand);
      formData.append("season", "all"); // default value

      if (image instanceof File) {
        formData.append("image", image);
      }
      if (careLabel instanceof File) {
        formData.append("care_label", careLabel);
      }

      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <PhotoUpload label="Item Image" value={image} onChange={setImage} />
        <PhotoUpload
          label="Care Label"
          value={careLabel}
          onChange={setCareLabel}
        />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Blue T-Shirt"
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Top"
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
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="e.g., Blue"
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
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., Nike"
        />
      </div>

      <div>
        <Label htmlFor="size">Size</Label>
        <Input
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="e.g., Medium"
          className={errors.size ? "border-red-500" : ""}
        />
        {errors.size && (
          <span className="text-sm text-red-500">{errors.size}</span>
        )}
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
          {isSubmitting ? "Saving..." : item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
