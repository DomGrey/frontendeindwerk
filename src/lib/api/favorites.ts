import { Favorite } from "../types";

export async function getFavorites(): Promise<Favorite[]> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userId: 1,
          itemType: "clothing",
          itemId: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          userId: 1,
          itemType: "outfit",
          itemId: 1,
          createdAt: new Date().toISOString(),
        },
        // Add more mock favorites as needed
      ]);
    }, 1000);
  });
}

export async function addFavorite(
  data: Omit<Favorite, "id" | "userId" | "createdAt">
): Promise<Favorite> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        userId: 1,
        createdAt: new Date().toISOString(),
        ...data,
      });
    }, 500);
  });
}

export async function removeFavorite(id: number): Promise<void> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

export async function isFavorite(
  itemType: "clothing" | "outfit",
  itemId: number
): Promise<boolean> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.5);
    }, 500);
  });
}
