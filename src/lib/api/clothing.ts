import {
  API_BASE_URL,
  getHeaders,
  getMultipartHeaders,
  ApiError,
} from "./config";
import type {
  ApiResponse,
  ClothingItem,
  ClothingItemSearchParams,
  CreateClothingItemData,
} from "../types/api";

export const getClothingItems = async (
  token: string,
  params?: { category?: string; season?: string }
): Promise<ClothingItem[]> => {
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const url = `${API_BASE_URL}/clothing-items${
    queryParams ? `?${queryParams}` : ""
  }`;

  const response = await fetch(url, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<ClothingItem[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch clothing items",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const searchClothingItems = async (
  token: string,
  params: ClothingItemSearchParams
): Promise<{
  items: ClothingItem[];
  total: number;
  page: number;
  pageSize: number;
}> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/clothing-items/search?${queryParams}`,
    {
      headers: getHeaders(token),
    }
  );

  const data: ApiResponse<ClothingItem[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Search failed",
      data.error?.code || "SEARCH_ERROR",
      response.status
    );
  }

  return {
    items: data.data,
    total: data.meta?.pagination?.total || 0,
    page: data.meta?.pagination?.page || 1,
    pageSize: data.meta?.pagination?.pageSize || 10,
  };
};

export const createClothingItem = async (
  token: string,
  itemData: CreateClothingItemData
): Promise<ClothingItem> => {
  const formData = new FormData();

  // Append all text fields
  Object.entries(itemData).forEach(([key, value]) => {
    if (value !== undefined && !(value instanceof File)) {
      formData.append(key, value.toString());
    }
  });

  // Append files if present
  if (itemData.image) {
    formData.append("image", itemData.image);
  }
  if (itemData.care_label) {
    formData.append("care_label", itemData.care_label);
  }

  const response = await fetch(`${API_BASE_URL}/clothing-items`, {
    method: "POST",
    headers: getMultipartHeaders(token),
    body: formData,
  });

  const data: ApiResponse<ClothingItem> = await response.json();

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

  const data: ApiResponse<ClothingItem> = await response.json();

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
  itemData: Partial<CreateClothingItemData>
): Promise<ClothingItem> => {
  const formData = new FormData();

  // Append all text fields
  Object.entries(itemData).forEach(([key, value]) => {
    if (value !== undefined && !(value instanceof File)) {
      formData.append(key, value.toString());
    }
  });

  // Append files if present
  if (itemData.image) {
    formData.append("image", itemData.image);
  }
  if (itemData.care_label) {
    formData.append("care_label", itemData.care_label);
  }

  const response = await fetch(`${API_BASE_URL}/clothing-items/${id}`, {
    method: "PUT",
    headers: getMultipartHeaders(token),
    body: formData,
  });

  const data: ApiResponse<ClothingItem> = await response.json();

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
