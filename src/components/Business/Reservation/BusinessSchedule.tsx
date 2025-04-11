import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { businessScheduleApi } from "@/api/business/business";
import { toast } from "sonner";
import {
  BlockTimePayload,
  ManageAvailableTimePayload,
  WeeklySchedule,
  ExceptionDate,
  DayOfWeek,
  ManageBusinessSchedulePayload,
} from "@/types/reservation";
import { ReservationStatus } from "@/types/api";
import { addDays, format } from "date-fns";

// 요일 표시용 한글명 (일요일부터 시작)
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// JavaScript 요일 인덱스: 0(일)~6(토), 하지만 UI에서는 월~일로 표시하기 때문에 맵핑 필요
const UI_TO_JS_DAY = [1, 2, 3, 4, 5, 6, 0]; // 월~일 → JS의 요일(월=1, 일=0)

// UI 인덱스를 요일 문자열로 변환 (일요일부터 시작)
const UI_TO_DAY_STRING = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

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
  const [lastSavedSchedule, setLastSavedSchedule] = useState<Schedule | null>(
    null
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

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
      setIsSaving(true);
      setSaveStatus("idle");

      // API 요청 페이로드 구성
      const payload: ManageBusinessSchedulePayload = {
        schedule: {
          selectedDays: schedule.selectedDays,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          breakTime: schedule.breakTime,
        },
      };

      console.log("📤 Payload to API:", payload);

      // 비즈니스 영업 일정 관리 API 호출
      await businessScheduleApi.manageBusinessSchedule(businessId, payload);

      // 저장 성공 시 현재 스케줄을 마지막 저장된 스케줄로 설정
      setLastSavedSchedule({ ...schedule });
      setSaveStatus("success");
      toast.success("영업 시간이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("영업 시간 저장 실패:", error);
      setSaveStatus("error");
      toast.error("영업 시간 설정에 실패했습니다.");
    } finally {
      setIsSaving(false);
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
                className={`w-full text-white ${
                  saveStatus === "success"
                    ? "bg-violet-600 hover:bg-violet-700"
                    : saveStatus === "error"
                    ? "bg-violet-600/80 hover:bg-violet-700/80"
                    : ""
                }`}
              >
                {isSaving ? (
                  "저장 중..."
                ) : saveStatus === "success" ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    저장 완료
                  </span>
                ) : saveStatus === "error" ? (
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    저장 실패
                  </span>
                ) : (
                  "영업 시간 저장"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">설정된 예약 가능 시간</h2>
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
                      {schedule.breakTime.start && schedule.breakTime.end && (
                        <span className="text-sm text-gray-400">
                          (휴식시간: {schedule.breakTime.start} -{" "}
                          {schedule.breakTime.end})
                        </span>
                      )}
                      {lastSavedSchedule && (
                        <span className="text-xs text-violet-600 ml-2">
                          (저장됨)
                        </span>
                      )}
                    </div>
                  </div>
                )
            )}
            {!schedule.selectedDays.some((day) => day) && (
              <div className="text-sm text-gray-500 italic">
                선택된 영업일이 없습니다. 위에서 요일을 선택해주세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
