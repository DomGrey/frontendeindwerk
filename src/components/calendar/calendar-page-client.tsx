"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { Card } from "@/components/ui/card";
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
        if (!apiSchedules || !Array.isArray(apiSchedules)) return;
        const newSchedules = apiSchedules.reduce((acc, apiSchedule) => {
          const schedule = toOutfitSchedule(apiSchedule);
          const key = schedule.scheduled_date.slice(0, 10);
          acc[key] = schedule;
          return acc;
        }, {} as Record<string, OutfitSchedule>);
        setSchedules((prev) => ({ ...prev, ...newSchedules }));
      } catch {
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
    } catch {
      toast.error("Could not unschedule outfit.");
    }
  };

  const scheduledDays = Object.keys(schedules).map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Outfit Calendar</h1>
        <h2 className="text-xl font-medium text-muted-foreground mt-1">
          Planned for {date ? format(date, "MMMM d, yyyy") : "..."}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="p-4 flex flex-col items-start min-h-[420px]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            modifiers={{ scheduled: scheduledDays }}
            modifiersClassNames={{ scheduled: "calendar-day-scheduled" }}
          />
        </Card>
        <Card className="p-6 flex items-center justify-center">
          {selectedSchedule ? (
            <div className="w-full max-w-lg mx-auto flex flex-col items-center">
              <div className="w-full">
                <OutfitCard
                  outfit={selectedSchedule.outfit}
                  isFavorited={false}
                  onFavorite={() => {}}
                  onDelete={() => {}}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnschedule}
                className="mt-4 mx-auto"
              >
                Remove
              </Button>
            </div>
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
        </Card>
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
