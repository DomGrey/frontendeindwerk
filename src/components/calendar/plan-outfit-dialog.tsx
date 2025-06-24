"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { getOutfits } from "@/lib/api/outfits";
import { scheduleOutfit } from "@/lib/api/outfit-schedules";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import type { Outfit } from "@/lib/types/api";

type PlanOutfitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  onPlanned?: () => void;
};
export default function PlanOutfitDialog({
  open,
  onOpenChange,
  date,
  onPlanned,
}: PlanOutfitDialogProps) {
  const { token } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    getOutfits(token)
      .then((res) => setOutfits(res.data || []))
      .finally(() => setLoading(false));
  }, [open, token]);

  const handlePlan = async () => {
    if (!token || !selected || !date) return;
    setSubmitting(true);
    try {
      await scheduleOutfit(token, selected, date);
      toast.success("Outfit planned");
      onPlanned && onPlanned();
      onOpenChange(false);
    } catch {
      toast.error("Failed to plan outfit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an Outfit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : outfits.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No outfits found
            </div>
          ) : (
            outfits.map((outfit) => (
              <button
                key={outfit.id}
                type="button"
                className={`border rounded transition p-1 ${
                  selected === outfit.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelected(outfit.id)}
                tabIndex={0}
              >
                <OutfitCard
                  outfit={outfit}
                  isFavorited={false}
                  onFavorite={() => {}}
                  onDelete={() => {}}
                />
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handlePlan}
            disabled={!selected || submitting}
            className="w-full"
          >
            {submitting ? "Planning..." : "Plan Selected Outfit"}
          </Button>
        </DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" className="w-full mt-2">
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
