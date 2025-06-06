import { Outfit } from "../types";

export async function getOutfits(): Promise<Outfit[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Casual Friday",
          description: "Perfect for a casual day at the office",
          clothingItemIds: [1, 2, 3],
          userId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Add more mock outfits as needed
      ]);
    }, 1000);
  });
}

export async function getOutfit(id: number): Promise<Outfit | null> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Casual Friday",
        description: "Perfect for a casual day at the office",
        clothingItemIds: [1, 2, 3],
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function createOutfit(
  data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Outfit> {
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

export async function updateOutfit(
  id: number,
  data: Partial<Outfit>
): Promise<Outfit> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: data.name || "Casual Friday",
        description:
          data.description || "Perfect for a casual day at the office",
        clothingItemIds: data.clothingItemIds || [1, 2, 3],
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function deleteOutfit(id: number): Promise<void> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}
