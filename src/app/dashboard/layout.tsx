import { ProtectedRoute } from "@/components/auth/protected-route";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Header />
      <main className="flex-1">{children}</main>
    </ProtectedRoute>
  );
}
