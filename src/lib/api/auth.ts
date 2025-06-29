import { API_BASE_URL, getHeaders, ApiError } from "./config";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  UpdateProfileData,
} from "../types/api";

export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse<{ token: string; user: User }>> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });

  const data: ApiResponse<{ token: string; user: User }> =
    await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Login failed",
      data.error?.code || "AUTH_ERROR",
      response.status
    );
  }

  return data;
};

export const register = async (
  credentials: RegisterCredentials
): Promise<ApiResponse<{ token: string; user: User }>> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(credentials),
  });

  const data: ApiResponse<{ token: string; user: User }> =
    await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Registration failed",
      data.error?.code || "AUTH_ERROR",
      response.status
    );
  }

  return data;
};

export const logout = async (token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: getHeaders(token),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(
      data.error?.message || "Logout failed",
      data.error?.code || "AUTH_ERROR",
      response.status
    );
  }
};

export const refreshToken = async (
  token: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: getHeaders(token),
  });

  const data: ApiResponse<AuthResponse> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Token refresh failed",
      data.error?.code || "AUTH_ERROR",
      response.status
    );
  }

  return data;
};

export const getMe = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders(token),
  });

  const data: ApiResponse<User> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to fetch user data",
      data.error?.code || "AUTH_ERROR",
      response.status
    );
  }

  return data.data;
};

export const updateProfile = async (
  token: string,
  profileData: UpdateProfileData
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(profileData),
  });

  const data: ApiResponse<User> = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(
      data.error?.message || "Failed to update profile",
      data.error?.code || "UPDATE_ERROR",
      response.status
    );
  }

  return data.data;
};
