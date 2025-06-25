import { ProtectedRoute } from "@/components/auth/protected-route";
import { FavoritesPageClient } from "@/components/favorites/favorites-page-client";

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPageClient />
    </ProtectedRoute>
  );
}
