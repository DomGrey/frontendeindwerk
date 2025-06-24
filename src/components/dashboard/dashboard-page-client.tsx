"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { getClothingItems } from "@/lib/api/clothing";
import { getOutfits } from "@/lib/api/outfits";
import { getFavorites } from "@/lib/api/favorites";
import { getOutfitSchedules } from "@/lib/api/outfit-schedules";
import Link from "next/link";
import { Shirt, Heart } from "lucide-react";
import { Icon } from "lucide-react";
import { coatHanger } from "@lucide/lab";
import { ClothingItem, OutfitSchedule } from "@/lib/types/api";
import { DashboardItemCard } from "./dashboard-item-card";
import { RandomSuggestions } from "./random-suggestions";
import { format } from "date-fns";
import Image from "next/image";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
}

function StatCard({ title, count, icon, href }: StatCardProps) {
  return (
    <Link href={href}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </Link>
  );
}

export function DashboardPageClient() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ clothing: 0, outfits: 0, favorites: 0 });
  const [recentItems, setRecentItems] = useState<ClothingItem[]>([]);
  const [allClothingItems, setAllClothingItems] = useState<ClothingItem[]>([]);
  const [scheduledOutfits, setScheduledOutfits] = useState<OutfitSchedule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        const [
          clothingItemsResponse,
          outfitsResponse,
          favoritesResponse,
          schedulesResponse,
        ] = await Promise.all([
          getClothingItems(token),
          getOutfits(token),
          getFavorites(token),
          getOutfitSchedules(
            token,
            format(new Date(), "yyyy-MM-dd"),
            "2100-01-01"
          ),
        ]);

        const allClothingItems: ClothingItem[] = clothingItemsResponse.data;
        const sortedItems = [...allClothingItems].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setStats({
          clothing: allClothingItems.length,
          outfits: outfitsResponse.data.length,
          favorites: favoritesResponse.data.length,
        });

        setRecentItems(sortedItems.slice(0, 4));
        setAllClothingItems(allClothingItems);

        // Only future schedules (today or later)
        const now = new Date();
        setScheduledOutfits(
          (schedulesResponse || []).filter(
            (s: OutfitSchedule) => new Date(s.scheduled_date) >= now
          )
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="h-24 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-24 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-24 rounded-lg bg-card border shadow animate-pulse" />
          </>
        ) : (
          <>
            <StatCard
              title="Clothing Items"
              count={stats.clothing}
              href="/clothing"
              icon={<Shirt className="h-8 w-8" />}
            />
            <StatCard
              title="Outfits"
              count={stats.outfits}
              href="/outfits"
              icon={<Icon iconNode={coatHanger} className="h-8 w-8" />}
            />
            <StatCard
              title="Favorites"
              count={stats.favorites}
              href="/favorites"
              icon={<Heart className="h-8 w-8" />}
            />
          </>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Items</h2>
        {isLoading ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recentItems.map((item) => (
              <DashboardItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <p className="text-muted-foreground">
              You haven&apos;t added any clothing items yet.
            </p>
            <Link
              href="/clothing"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Add your first item
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Scheduled Outfits</h2>
        {isLoading ? (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
            <div className="h-48 rounded-lg bg-card border shadow animate-pulse" />
          </div>
        ) : scheduledOutfits.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {scheduledOutfits.map((schedule: OutfitSchedule) => {
              const imageUrl =
                schedule.outfit.clothing_items[0]?.image_url ||
                "/placeholder.svg";
              return (
                <div
                  key={schedule.id}
                  className="rounded-lg border bg-card p-4 flex flex-col items-center"
                >
                  <div className="w-full max-w-xs flex flex-col items-center">
                    <Image
                      src={imageUrl}
                      alt={schedule.outfit.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded mb-2"
                    />
                    <div className="font-semibold mb-1">
                      {schedule.outfit.name}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {format(
                        new Date(schedule.scheduled_date),
                        "MMMM d, yyyy"
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 rounded-lg border-2 border-dashed border-muted-foreground/30">
            <p className="text-muted-foreground">
              No upcoming outfits scheduled.
            </p>
          </div>
        )}
      </div>

      <RandomSuggestions items={allClothingItems} />
    </div>
  );
}
