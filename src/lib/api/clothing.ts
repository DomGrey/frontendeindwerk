import { ClothingItem } from "../types";

export async function getClothingItems(): Promise<ClothingItem[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Blue Jeans",
          size: "32",
          imageUrl: "/placeholder.jpg",
          category: "Pants",
          color: "Blue",
          brand: "Levi's",
          userId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Add more mock items as needed
      ]);
    }, 1000);
  });
}

export async function getClothingItem(
  id: number
): Promise<ClothingItem | null> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Blue Jeans",
        size: "32",
        imageUrl: "/placeholder.jpg",
        category: "Pants",
        color: "Blue",
        brand: "Levi's",
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function createClothingItem(
  data: Omit<ClothingItem, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<ClothingItem> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      });
    }, 500);
  });
}

export async function updateClothingItem(
  id: number,
  data: Partial<ClothingItem>
): Promise<ClothingItem> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: data.name || "Blue Jeans",
        size: data.size || "32",
        imageUrl: data.imageUrl || "/placeholder.jpg",
        category: data.category || "Pants",
        color: data.color || "Blue",
        brand: data.brand || "Levi's",
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function deleteClothingItem(id: number): Promise<void> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}
