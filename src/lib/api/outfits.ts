import { API_BASE_URL, getHeaders, ApiError } from "./config";
import type {
  ApiResponse,
  Outfit,
  OutfitSearchParams,
  CreateOutfitData,
} from "../types/api";

export const getOutfits = async (
  token: string,
  perPage?: number
): Promise<{
  outfits: Outfit[];
  total: number;
  page: number;
  pageSize: number;
}> => {
  const queryParams = new URLSearchParams();
  if (perPage) {
    queryParams.append("per_page", perPage.toString());
  }

  const response = await fetch(`${API_BASE_URL}/outfits?${queryParams}`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<Outfit[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch outfits",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return {
    outfits: data.data,
    total: data.meta?.pagination?.total || 0,
    page: data.meta?.pagination?.page || 1,
    pageSize: data.meta?.pagination?.pageSize || 10,
  };
};

export const searchOutfits = async (
  token: string,
  params: OutfitSearchParams
): Promise<{
  outfits: Outfit[];
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
    `${API_BASE_URL}/outfits/search?${queryParams}`,
    {
      headers: getHeaders(token),
    }
  );

  const data: ApiResponse<Outfit[]> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Search failed",
      data.error?.code || "SEARCH_ERROR",
      response.status
    );
  }

  return {
    outfits: data.data,
    total: data.meta?.pagination?.total || 0,
    page: data.meta?.pagination?.page || 1,
    pageSize: data.meta?.pagination?.pageSize || 10,
  };
};

export const createOutfit = async (
  token: string,
  outfitData: CreateOutfitData
): Promise<Outfit> => {
  const response = await fetch(`${API_BASE_URL}/outfits`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(outfitData),
  });

  const data: ApiResponse<Outfit> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to create outfit",
      data.error?.code || "CREATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const getOutfit = async (token: string, id: number): Promise<Outfit> => {
  const response = await fetch(`${API_BASE_URL}/outfits/${id}`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<Outfit> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch outfit",
      data.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const updateOutfit = async (
  token: string,
  id: number,
  outfitData: Partial<CreateOutfitData>
): Promise<Outfit> => {
  const response = await fetch(`${API_BASE_URL}/outfits/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(outfitData),
  });

  const data: ApiResponse<Outfit> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to update outfit",
      data.error?.code || "UPDATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const deleteOutfit = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/outfits/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(
      data.error?.message || "Failed to delete outfit",
      data.error?.code || "DELETE_ERROR",
      response.status
    );
  }
};
