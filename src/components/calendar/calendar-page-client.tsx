"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { OutfitSchedule } from "@/lib/types";
import { useAuth } from "@/lib/context/auth-context";
import {
  getOutfitSchedules,
  unscheduleOutfit,
} from "@/lib/api/outfit-schedules";
import { toOutfitSchedule } from "@/lib/utils";
import { toast } from "react-toastify";

export function CalendarPageClient() {
  const { token } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<Record<string, OutfitSchedule>>(
    {}
  );

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
        const newSchedules = apiSchedules.reduce((acc, apiSchedule) => {
          const schedule = toOutfitSchedule(apiSchedule);
          acc[schedule.scheduledDate] = schedule;
          return acc;
        }, {} as Record<string, OutfitSchedule>);
        setSchedules((prev) => ({ ...prev, ...newSchedules }));
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
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

  const scheduledDays = Object.keys(schedules).map(
    (dateStr) => new Date(dateStr.replace(/-/g, "/"))
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Outfit Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="rounded-lg border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="p-3"
              modifiers={{ scheduled: scheduledDays }}
              modifiersClassnames={{
                scheduled: "day-scheduled",
              }}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Planned for {date ? format(date, "MMMM d, yyyy") : "..."}
            </h2>
            {selectedSchedule && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleUnschedule}
              >
                Unschedule
              </Button>
            )}
          </div>
          <div className="rounded-lg border p-4 min-h-[300px] flex items-center justify-center">
            {selectedSchedule ? (
              <div className="w-full max-w-sm">
                <OutfitCard
                  outfit={selectedSchedule.outfit}
                  isFavorited={false}
                  onFavorite={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No outfit planned for this date.
                </p>
                <Button>Plan an Outfit</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
