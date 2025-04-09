import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";
import { businessReservationApi } from "@/api/business/business";
import { toast } from "sonner";
import {
  DayOfWeek,
  ExceptionDate,
  WeeklySchedule,
  ManageAvailableTimePayload,
} from "@/types/reservation";
import { addMinutes } from "date-fns";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

interface Schedule {
  startTime: string;
  endTime: string;
  breakTime: {
    start: string;
    end: string;
  };
  selectedDays: boolean[];
}

interface BusinessScheduleProps {
  schedule: Schedule;
  onScheduleChange: (schedule: Schedule) => void;
  businessId: string;
}

export default function BusinessSchedule({
  schedule,
  onScheduleChange,
  businessId,
}: BusinessScheduleProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleTimeChange = (
    field: keyof Schedule | keyof Schedule["breakTime"],
    value: string
  ) => {
    if (field === "startTime" || field === "endTime") {
      onScheduleChange({
        ...schedule,
        [field]: value,
      });
    } else if (field === "start" || field === "end") {
      onScheduleChange({
        ...schedule,
        breakTime: {
          ...schedule.breakTime,
          [field]: value,
        },
      });
    }
  };

  const handleDayToggle = (index: number) => {
    const newSelectedDays = [...schedule.selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    onScheduleChange({
      ...schedule,
      selectedDays: newSelectedDays,
    });
  };
  const saveSchedule = async () => {
    try {
      const dayMap: DayOfWeek[] = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];

      const weekly_schedule: WeeklySchedule[] = schedule.selectedDays
        .map((isSelected, i) =>
          isSelected
            ? {
                day_of_week: dayMap[i],
                start_time: schedule.startTime,
                end_time: schedule.endTime,
              }
            : null
        )
        .filter((s): s is WeeklySchedule => s !== null);

      const exception_dates: ExceptionDate[] = schedule.selectedDays
        .map((isSelected, i) =>
          isSelected && schedule.breakTime.start && schedule.breakTime.end
            ? {
                day_of_week: dayMap[i],
                start_time: schedule.breakTime.start,
                end_time: schedule.breakTime.end,
                reason: "휴식 시간",
              }
            : null
        )
        .filter((e): e is ExceptionDate => e !== null);

      const payload: ManageAvailableTimePayload = {
        weekly_schedule,
        exception_dates,
      };

      // ✅ 디버깅용 콘솔 로그 추가
      console.log("📦 예약 가능 시간 payload:", payload);
      console.log("📌 businessId:", businessId);

      await businessReservationApi.manageAvailableTime(businessId, payload);
      toast.success("예약 가능 시간이 저장되었습니다.");
    } catch (error) {
      console.error("예약 가능 시간 저장 실패:", error);
      toast.error("예약 가능 시간 저장에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">영업 시간 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  영업 시작 시간
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleTimeChange("startTime", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  영업 종료 시간
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleTimeChange("endTime", e.target.value)
                    }
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  휴식 시간 시작
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    type="time"
                    value={schedule.breakTime.start}
                    onChange={(e) => handleTimeChange("start", e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  휴식 시간 종료
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    type="time"
                    value={schedule.breakTime.end}
                    onChange={(e) => handleTimeChange("end", e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                영업 요일
              </label>
              <div className="flex gap-2 text-violet-500">
                {DAYS.map((day, index) => (
                  <Button
                    key={day}
                    variant={
                      schedule.selectedDays[index] ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleDayToggle(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={saveSchedule}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "저장 중..." : "영업 시간 저장"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            예약 가능 시간 미리보기
          </h2>
          <div className="space-y-4">
            {DAYS.map(
              (day, index) =>
                schedule.selectedDays[index] && (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{day}요일</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                      <span className="text-sm text-gray-400">
                        (휴식시간: {schedule.breakTime.start} -{" "}
                        {schedule.breakTime.end})
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
