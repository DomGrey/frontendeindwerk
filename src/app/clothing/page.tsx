import { ProtectedRoute } from "@/components/auth/protected-route";
import { ClothingPageClient } from "@/components/clothing/clothing-page-client";

export default function ClothingPage() {
  return (
    <ProtectedRoute>
      <ClothingPageClient />
    </ProtectedRoute>
  );
}
