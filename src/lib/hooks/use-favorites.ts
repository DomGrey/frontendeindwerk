"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { addFavorite, removeFavorite } from "@/lib/api/favorites";
import { toast } from "react-toastify";
import type { FavoriteType } from "@/lib/types/api";

export function useFavorites() {
  const { token } = useAuth();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleFavorite = useCallback(
    async (id: number, type: FavoriteType, isFavorited: boolean) => {
      if (!token) {
        toast.error("Please log in to use favorites");
        return isFavorited;
      }

      const key = `${type}-${id}`;
      setLoading((prev) => ({ ...prev, [key]: true }));

      try {
        if (isFavorited) {
          await removeFavorite(token, {
            favoritable_id: id,
            favoritable_type: type,
          });
          toast.success("Removed from favorites");
        } else {
          await addFavorite(token, {
            favoritable_id: id,
            favoritable_type: type,
          });
          toast.success("Added to favorites");
        }

        return !isFavorited;
      } catch (error) {
        console.error("API Error:", error);

        // Handle specific error codes
        if (error instanceof Error) {
          if (error.message.includes("403")) {
            toast.error("You don't have permission to perform this action");
          } else if (error.message.includes("422")) {
            toast.error("Invalid data format. Please try again.");
          } else if (error.message.includes("401")) {
            toast.error("Please log in again");
          } else {
            toast.error(error.message || "Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }

        return isFavorited; // Keep current state on error
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [token]
  );

  const isLoading = useCallback(
    (id: number, type: FavoriteType) => {
      const key = `${type}-${id}`;
      return loading[key] || false;
    },
    [loading]
  );

  return { toggleFavorite, isLoading };
}
