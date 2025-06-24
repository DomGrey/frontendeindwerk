import {
  API_BASE_URL,
  getHeaders,
  getMultipartHeaders,
  ApiError,
} from "./config";
import type {
  ApiResponse,
  ClothingItem as ApiClothingItem,
  ClothingItemSearchParams,
} from "../types/api";
import type { ClothingItem } from "@/lib/types/api";
import type {
  ClothingItemOptions,
  ClothingItemOptionsResponse,
} from "@/lib/types/api";

export const getClothingItems = async (
  token: string,
  params?: ClothingItemSearchParams
): Promise<ApiResponse<ClothingItem[]>> => {
  const queryParams = new URLSearchParams();
  let hasParams = false;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
        hasParams = true;
      }
    });
  }

  const endpoint = hasParams ? "/clothing-items/search" : "/clothing-items";
  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<ApiClothingItem[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch clothing items",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data;
};

export const createClothingItem = async (
  token: string,
  formData: FormData
): Promise<ClothingItem> => {
  const response = await fetch(`${API_BASE_URL}/clothing-items`, {
    method: "POST",
    headers: getMultipartHeaders(token),
    body: formData,
  });

  const data: ApiResponse<ApiClothingItem> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to create clothing item",
      data.error?.code || "CREATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const getClothingItem = async (
  token: string,
  id: number
): Promise<ClothingItem> => {
  const response = await fetch(`${API_BASE_URL}/clothing-items/${id}`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<ApiClothingItem> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch clothing item",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const updateClothingItem = async (
  token: string,
  id: number,
  formData: FormData
): Promise<ClothingItem> => {
  // Laravel needs this to handle PUT with FormData
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await fetch(`${API_BASE_URL}/clothing-items/${id}`, {
    method: "POST", // Use POST for FormData with _method
    headers: getMultipartHeaders(token),
    body: formData,
  });

  const data: ApiResponse<ApiClothingItem> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to update clothing item",
      data.error?.code || "UPDATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const deleteClothingItem = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/clothing-items/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(
      data.error?.message || "Failed to delete clothing item",
      data.error?.code || "DELETE_ERROR",
      response.status
    );
  }
};

export const getClothingItemOptions = async (
  token: string
): Promise<ClothingItemOptions> => {
  const response = await fetch(`${API_BASE_URL}/clothing-items/options`, {
    headers: getHeaders(token),
  });
  const data: ClothingItemOptionsResponse = await response.json();
  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch clothing item options",
      data.error?.code || "OPTIONS_ERROR",
      response.status
    );
  }
  return data.data;
};
