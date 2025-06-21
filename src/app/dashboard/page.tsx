import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageClient />
    </ProtectedRoute>
  );
}
