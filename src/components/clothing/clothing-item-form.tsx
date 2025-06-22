"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ClothingItem } from "@/lib/types";

const clothingItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  color: z.string().min(1, "Color is required"),
  brand: z.string().optional(),
  sizeType: z.string().min(1, "Size type is required"),
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

const categories = [
  "Top",
  "Bottom",
  "Dress",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Underwear",
  "Sleepwear",
];

const sizeTypes = [
  { value: "letter", label: "Letter (S, M, L, XL)" },
  { value: "number", label: "Number (36, 38, 40, 42)" },
  { value: "custom", label: "Custom Size" },
];

const letterSizes = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "One Size",
];

const numberSizes = [
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "54",
  "56",
  "58",
  "60",
];

const seasons = ["All-Year", "Spring", "Summer", "Autumn", "Winter"];

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
  const [image, setImage] = useState<File | string | null>(
    item?.imageUrl || null
  );
  const [careLabel, setCareLabel] = useState<File | string | null>(null);
  const [sizeType, setSizeType] = useState<string>("letter");

  const form = useForm<ClothingItemFormData>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      color: item?.color || "",
      brand: item?.brand || "",
      sizeType: "letter",
      size: item?.size || "",
      season: item?.season || "All-Year",
      description: "",
    },
  });

  useEffect(() => {
    if (item) {
      // Determine size type from existing size
      let detectedSizeType = "letter";
      if (item.size && /^\d+$/.test(item.size)) {
        detectedSizeType = "number";
      } else if (
        item.size &&
        !letterSizes.includes(item.size) &&
        !numberSizes.includes(item.size)
      ) {
        detectedSizeType = "custom";
      }

      setSizeType(detectedSizeType);
      form.reset({
        name: item.name,
        category: item.category,
        color: item.color,
        brand: item.brand || "",
        sizeType: detectedSizeType,
        size: item.size,
        season: item.season || "All-Year",
        description: "",
      });
      setImage(item.imageUrl || null);
    }
  }, [item, form]);

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

  const handleSizeTypeChange = (newSizeType: string) => {
    setSizeType(newSizeType);
    form.setValue("sizeType", newSizeType);
    form.setValue("size", ""); // Reset size when type changes
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sizeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSizeTypeChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                {sizeType === "custom" ? (
                  <FormControl>
                    <Input
                      placeholder="e.g., 10.5, 28x32, Custom"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(sizeType === "number" ? numberSizes : letterSizes).map(
                        (size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
