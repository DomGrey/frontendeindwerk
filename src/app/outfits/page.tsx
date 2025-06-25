import { ProtectedRoute } from "@/components/auth/protected-route";
import { OutfitsPageClient } from "@/components/outfit/outfits-page-client";

export default function OutfitsPage() {
  return (
    <ProtectedRoute>
      <OutfitsPageClient />
    </ProtectedRoute>
  );
}
