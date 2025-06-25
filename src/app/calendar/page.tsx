import { ProtectedRoute } from "@/components/auth/protected-route";
import { CalendarPageClient } from "@/components/calendar/calendar-page-client";

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarPageClient />
    </ProtectedRoute>
  );
}
