import { API_BASE_URL, getHeaders, ApiError } from "./config";
import type { ApiResponse, Favorite, CreateFavoriteData } from "../types/api";

export const getFavorites = async (token: string): Promise<Favorite[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<Favorite[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch favorites",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const getFavoriteClothingItems = async (
  token: string
): Promise<Favorite[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites/clothing-items`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<Favorite[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch favorite clothing items",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const getFavoriteOutfits = async (
  token: string
): Promise<Favorite[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites/outfits`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<Favorite[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch favorite outfits",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const addFavorite = async (
  token: string,
  favoriteData: CreateFavoriteData
): Promise<Favorite> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(favoriteData),
  });

  const data: ApiResponse<Favorite> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to add favorite",
      data.error?.code || "CREATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const removeFavorite = async (
  token: string,
  favoriteData: CreateFavoriteData
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: "DELETE",
    headers: getHeaders(token),
    body: JSON.stringify(favoriteData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(
      data.error?.message || "Failed to remove favorite",
      data.error?.code || "DELETE_ERROR",
      response.status
    );
  }
};
