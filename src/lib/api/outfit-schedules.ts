import { API_BASE_URL, getHeaders, ApiError } from "./config";
import type { ApiResponse, OutfitSchedule } from "../types/api";

export const getOutfitSchedules = async (
  token: string,
  startDate: string,
  endDate: string
): Promise<OutfitSchedule[]> => {
  const queryParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  });

  const response = await fetch(
    `${API_BASE_URL}/outfit-schedules?${queryParams}`,
    {
      headers: getHeaders(token),
    }
  );

  const rawData = await response.json();
  console.log("Raw API response for schedules:", rawData);

  if (!response.ok) {
    throw new ApiError(
      rawData.error?.message || "Failed to fetch outfit schedules",
      rawData.error?.code || "FETCH_ERROR",
      response.status
    );
  }

  const data: ApiResponse<OutfitSchedule[]> = rawData;

  if (data.error) {
    throw new ApiError(
      data.error.message || "Failed to fetch outfit schedules",
      data.error.code || "FETCH_ERROR",
      response.status
    );
  }

  if (!data.data || !Array.isArray(data.data)) {
    console.warn("Invalid data structure received:", data);
    return [];
  }

  return data.data;
};

export const scheduleOutfit = async (
  token: string,
  outfitId: number,
  scheduledDate: string
): Promise<OutfitSchedule> => {
  const response = await fetch(`${API_BASE_URL}/outfit-schedules`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({
      outfit_id: outfitId,
      date: scheduledDate,
    }),
  });

  const data: ApiResponse<OutfitSchedule> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to schedule outfit",
      data.error?.code || "CREATE_ERROR",
      response.status
    );
  }

  return data.data;
};

export const unscheduleOutfit = async (
  token: string,
  scheduleId: number
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/outfit-schedules/${scheduleId}`,
    {
      method: "DELETE",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.error?.message || "Failed to unschedule outfit",
      data.error?.code || "DELETE_ERROR",
      response.status
    );
  }
};
