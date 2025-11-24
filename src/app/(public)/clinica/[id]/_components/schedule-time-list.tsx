"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from '@/lib/utils'
import { isSlotInThePast, isToday, isSlotSequenceAvailable } from './schedule-utils'

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedTime,
  onSelectTime
}: ScheduleTimeListProps) {

  const dateIsToday = isToday(selectedDate)


  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 w-full">
      {availableTimeSlots.map((slot) => {

        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        )

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time)

        const slotEnabled = slot.available && sequenceOK && !slotIsPast;


        return (
          <Button
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn("h-12 w-full select-none text-sm font-medium transition-all",
              selectedTime === slot.time && "border-2 border-emerald-500 bg-emerald-50 text-emerald-700",
              !slotEnabled && "opacity-40 cursor-not-allowed"
            )}
            disabled={!slotEnabled}
          >
            {slot.time}
          </Button>
        )
      })}

    </div>
  )
}