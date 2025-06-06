"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { OutfitDialog } from "@/components/outfit/outfit-dialog";
import { Outfit } from "@/lib/types";
import { getOutfits, createOutfit } from "@/lib/api/outfits";

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | undefined>();

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const data = await getOutfits();
        setOutfits(data);
      } catch (error) {
        console.error("Failed to fetch outfits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  const handleCreateOutfit = async (
    data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newOutfit = await createOutfit(data);
      setOutfits((prev) => [...prev, newOutfit]);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to create outfit:", error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Outfits</h1>
        <Button
          onClick={() => {
            setSelectedOutfit(undefined);
            setDialogOpen(true);
          }}
        >
          Create Outfit
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card text-card-foreground shadow animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-6">
                  <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))
          : outfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onFavorite={() => {
                  // TODO: Implement favorite functionality
                  console.log("Favorite:", outfit.id);
                }}
                onDelete={() => {
                  // TODO: Implement delete functionality
                  console.log("Delete:", outfit.id);
                }}
              />
            ))}
      </div>
      <OutfitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        outfit={selectedOutfit}
        onSubmit={handleCreateOutfit}
      />
    </div>
  );
}
