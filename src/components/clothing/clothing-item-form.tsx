"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClothingItem } from "@/lib/types";

interface ClothingItemFormProps {
  onSubmit: (data: Partial<ClothingItem>) => void;
  initialData?: Partial<ClothingItem>;
}

export function ClothingItemForm({
  onSubmit,
  initialData,
}: ClothingItemFormProps) {
  const [formData, setFormData] = useState<Partial<ClothingItem>>(
    initialData || {
      name: "",
      category: "",
      color: "",
      brand: "",
      size: "",
      imageUrl: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
          required
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
          required
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          value={formData.brand}
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
          required
        />
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

      <Button type="submit" className="w-full">
        {initialData ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}
