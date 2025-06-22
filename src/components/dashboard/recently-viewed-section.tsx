import { ClothingItem } from "@/lib/types";
import { DashboardItemCard } from "./dashboard-item-card";
import { Eye } from "lucide-react";

interface RecentlyViewedSectionProps {
  items: ClothingItem[];
}

export function RecentlyViewedSection({ items }: RecentlyViewedSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <DashboardItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
