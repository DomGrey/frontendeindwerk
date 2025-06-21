import { ClothingItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface DashboardItemCardProps {
  item: ClothingItem;
}

export function DashboardItemCard({ item }: DashboardItemCardProps) {
  return (
    <Link href="/clothing">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </div>
      </div>
    </Link>
  );
}
