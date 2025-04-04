import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";

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
}

export default function BusinessSchedule({
  schedule,
  onScheduleChange,
}: BusinessScheduleProps) {
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
