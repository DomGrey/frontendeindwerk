"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { CalendarCheck2 } from "lucide-react";

import { useAuth } from "@/lib/context/auth-context";
import {
  getOutfitSchedules,
  unscheduleOutfit,
} from "@/lib/api/outfit-schedules";
import { toOutfitSchedule } from "@/lib/utils";
import { toast } from "react-toastify";
import type { OutfitSchedule } from "@/lib/types/api";
import PlanOutfitDialog from "./plan-outfit-dialog";

export function CalendarPageClient() {
  const { token } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<Record<string, OutfitSchedule>>(
    {}
  );
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";
  const selectedSchedule = schedules[selectedDateStr];

  const fetchSchedules = useCallback(
    async (month: Date) => {
      if (!token) return;

      const startDate = format(startOfMonth(month), "yyyy-MM-dd");
      const endDate = format(endOfMonth(month), "yyyy-MM-dd");

      try {
        const apiSchedules = await getOutfitSchedules(
          token,
          startDate,
          endDate
        );

        console.log("Raw API response:", apiSchedules);

        if (!apiSchedules || !Array.isArray(apiSchedules)) {
          console.warn("Invalid schedules data received:", apiSchedules);
          return;
        }

        const newSchedules = apiSchedules.reduce((acc, apiSchedule) => {
          const schedule = toOutfitSchedule(apiSchedule);
          const key = schedule.scheduled_date.slice(0, 10);
          acc[key] = schedule;
          return acc;
        }, {} as Record<string, OutfitSchedule>);
        setSchedules((prev) => ({ ...prev, ...newSchedules }));
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
        toast.error("Could not load outfit schedules.");
      }
    },
    [token]
  );

  useEffect(() => {
    fetchSchedules(currentMonth);
  }, [currentMonth, fetchSchedules]);

  const handleUnschedule = async () => {
    if (!token || !selectedSchedule) return;

    try {
      await unscheduleOutfit(token, selectedSchedule.id);
      setSchedules((prev) => {
        const newSchedules = { ...prev };
        delete newSchedules[selectedDateStr];
        return newSchedules;
      });
      toast.success("Outfit unscheduled successfully.");
    } catch (error) {
      console.error("Failed to unschedule outfit:", error);
      toast.error("Could not unschedule outfit.");
    }
  };

  const scheduledDays = Object.keys(schedules).map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Outfit Calendar</h1>
      <h2 className="text-2xl font-semibold mb-8">
        Planned for {date ? format(date, "MMMM d, yyyy") : "..."}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 flex flex-col items-start">
          <div className="rounded-lg border bg-white shadow-sm w-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="p-3"
              modifiers={{ scheduled: scheduledDays }}
              modifiersClassNames={{
                scheduled: "calendar-day-scheduled",
              }}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-lg border p-8 min-h-[320px] flex items-center justify-center bg-white shadow-sm">
            {selectedSchedule ? (
              <button
                type="button"
                className="w-full max-w-sm outline-none focus:ring-2 focus:ring-primary rounded"
                onClick={() => setPlanDialogOpen(true)}
                tabIndex={0}
              >
                <OutfitCard
                  outfit={selectedSchedule.outfit}
                  isFavorited={false}
                  onFavorite={() => {}}
                  onDelete={() => {}}
                />
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <CalendarCheck2 className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">
                  No outfit planned for this date.
                </p>
                <Button onClick={() => setPlanDialogOpen(true)}>
                  Plan an Outfit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <PlanOutfitDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        date={selectedDateStr}
        onPlanned={() => fetchSchedules(currentMonth)}
      />
    </div>
  );
}
