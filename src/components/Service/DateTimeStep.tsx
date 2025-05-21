"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Calendar from "@/components/ClientCalender";
import { userReservationApi } from "@/app/api/user/user";
import {
  format,
  parse,
  isSameDay,
  startOfMonth,
  addDays,
  getDay,
} from "date-fns";
import { toast } from "react-toastify";
import {
  DayAvailability,
  MonthlySchedule,
  DailySchedule,
} from "@/app/api/user/user";

// 날짜의 요일 번호 변환 (0=월요일, 1=화요일, ... 6=일요일)
const getAdjustedDayNumber = (date: Date): number => {
  // JavaScript의 getDay()는 0(일요일)~6(토요일)을 반환
  // 0(월요일)~6(일요일) 형식으로 변환
  const jsDay = getDay(date);
  // 일요일(0)을 6으로, 나머지는 -1
  return jsDay === 0 ? 6 : jsDay - 1;
};

// 날짜의 요일 번호(0:월요일, 1:화요일, ..., 6:일요일)를 영문 대문자 요일로 변환
const getDayOfWeekString = (date: Date): string => {
  // 요일을 API 응답 형식에 맞게 변환
  const adjustedDayNumber = getAdjustedDayNumber(date);
  const jsDay = getDay(date); // 원래 JavaScript 요일 번호 (디버깅용)

  // 요일 매핑 배열 (0=월요일, 6=일요일)
  const dayOfWeekMap = [
    "MONDAY", // 0: 월요일
    "TUESDAY", // 1: 화요일
    "WEDNESDAY", // 2: 수요일
    "THURSDAY", // 3: 목요일
    "FRIDAY", // 4: 금요일
    "SATURDAY", // 5: 토요일
    "SUNDAY", // 6: 일요일
  ];

  const dayOfWeek = dayOfWeekMap[adjustedDayNumber];

  // 검증을 위한 로깅
  console.log(
    `요일 매핑 - 날짜: ${format(
      date,
      "yyyy-MM-dd"
    )}, JS요일번호: ${jsDay}, 조정된요일번호: ${adjustedDayNumber}, 매핑결과: ${dayOfWeek}`
  );

  return dayOfWeek;
};

// 디버깅용: 요일 이름 한글로 변환
const getDayOfWeekKorean = (date: Date): string => {
  const adjustedDayNumber = getAdjustedDayNumber(date);
  const dayOfWeekMap = ["월", "화", "수", "목", "금", "토", "일"];
  return dayOfWeekMap[adjustedDayNumber];
};

// 영문 요일을 한글로 변환하는 헬퍼 함수
const dayToKorean = (day: string): string => {
  const map: Record<string, string> = {
    MONDAY: "월",
    TUESDAY: "화",
    WEDNESDAY: "수",
    THURSDAY: "목",
    FRIDAY: "금",
    SATURDAY: "토",
    SUNDAY: "일",
  };
  return map[day] || "알 수 없음";
};

interface DateTimeStepProps {
  onNext: (date: Date, time: string) => void;
  onBack: () => void;
  businessId: string;
  serviceId: string;
}

interface TimeSlots {
  morning: string[];
  afternoon: string[];
}

export default function DateTimeStep({
  onNext,
  onBack,
  businessId,
  serviceId,
}: DateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentYearMonth, setCurrentYearMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showNoAvailability, setShowNoAvailability] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlots>({
    morning: [],
    afternoon: [],
  });
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const [monthlySchedule, setMonthlySchedule] =
    useState<MonthlySchedule | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // 월별 스케줄 조회
  useEffect(() => {
    const fetchMonthlySchedule = async () => {
      if (!businessId || !serviceId) return;

      try {
        setIsLoadingCalendar(true);
        const scheduleData = await userReservationApi.getMonthlySchedule(
          businessId,
          serviceId,
          currentYearMonth
        );
        console.log("월별 스케줄 데이터:", scheduleData);
        console.log("주간 스케줄 데이터:", scheduleData.weekly_schedule);

        // 주간 스케줄 데이터의 요일별 휴무일 여부 확인 (디버깅용)
        if (scheduleData.weekly_schedule) {
          console.log("=== 주간 스케줄 요일별 휴무일 분석 ===");
          [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
          ].forEach((day) => {
            const daySchedule = scheduleData.weekly_schedule[day];
            if (daySchedule) {
              console.log(
                `${day} (${dayToKorean(day)}요일): ${
                  daySchedule.is_day_off ? "휴무일" : "영업일"
                }`
              );
            } else {
              console.log(`${day}: 정보 없음`);
            }
          });
        }

        setMonthlySchedule(scheduleData);
      } catch (error) {
        console.error("월별 스케줄 로드 실패:", error);
        toast.error("예약 가능 날짜 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoadingCalendar(false);
      }
    };

    fetchMonthlySchedule();
  }, [businessId, serviceId, currentYearMonth]);

  // 캘린더 월 변경 감지
  useEffect(() => {
    if (calendarDate) {
      const newYearMonth = format(calendarDate, "yyyy-MM");
      if (newYearMonth !== currentYearMonth) {
        setCurrentYearMonth(newYearMonth);
      }
    }
  }, [calendarDate, currentYearMonth]);

  // 날짜 선택 처리
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setIsLoadingTimes(true);

    try {
      // API를 통해 선택한 날짜의 예약 가능 시간 가져오기
      const formattedDate = format(date, "yyyy-MM-dd");
      const scheduleData = await userReservationApi.getDailySchedule(
        businessId,
        serviceId,
        formattedDate
      );

      // 요일을 요일 문자열로 표시(디버깅용)
      const adjustedDayNumber = getAdjustedDayNumber(date);
      const jsDay = getDay(date);
      const selectedDayOfWeek = getDayOfWeekString(date);

      console.log(
        `선택한 날짜: ${format(date, "yyyy-MM-dd")}, ` +
          `JS요일번호: ${jsDay}, ` +
          `조정된요일번호: ${adjustedDayNumber}, ` +
          `요일: ${selectedDayOfWeek}, ` +
          `한글요일: ${getDayOfWeekKorean(date)}`
      );
      console.log("Schedule data:", scheduleData);

      // 오전/오후로 시간 구분하기
      const morning: string[] = [];
      const afternoon: string[] = [];

      if (
        scheduleData.available_time_slots &&
        scheduleData.available_time_slots.length > 0
      ) {
        scheduleData.available_time_slots.forEach((time) => {
          const hour = parseInt(time.split(":")[0], 10);
          if (hour < 12) {
            morning.push(time);
          } else {
            afternoon.push(time);
          }
        });
      }

      setAvailableTimeSlots({ morning, afternoon });
      setShowNoAvailability(
        scheduleData.is_day_off ||
          !scheduleData.available_time_slots ||
          scheduleData.available_time_slots.length === 0
      );
    } catch (error) {
      console.error("예약 가능 시간 로드 실패:", error);
      toast.error("예약 가능 시간 정보를 불러오지 못했습니다.");
      setShowNoAvailability(true);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  // 월별 스케줄에서 예약불가 날짜 계산
  const disabledDates = useMemo(() => {
    if (!monthlySchedule) return [];

    const disabledDatesArray: Date[] = [];

    // 월간 일정에서 휴무일 확인
    Object.entries(monthlySchedule.availability_by_date).forEach(
      ([dateStr, availability]) => {
        if (availability.is_day_off) {
          disabledDatesArray.push(parse(dateStr, "yyyy-MM-dd", new Date()));
        }
      }
    );

    // 주간 스케줄(weekly_schedule)에서 휴무일 확인
    if (monthlySchedule.weekly_schedule) {
      // 해당 월의 모든 날짜를 확인
      const firstDayOfMonth = startOfMonth(
        parse(currentYearMonth + "-01", "yyyy-MM-dd", new Date())
      );
      const daysInMonth = monthlySchedule.days_in_month;

      console.log("=== 월별 날짜와 요일 매핑 ===");
      console.log(
        "첫 날짜:",
        format(firstDayOfMonth, "yyyy-MM-dd"),
        "요일:",
        getDayOfWeekString(firstDayOfMonth),
        "한글요일:",
        getDayOfWeekKorean(firstDayOfMonth)
      );

      // 각 요일별 휴무일 확인 (디버깅용)
      Object.entries(monthlySchedule.weekly_schedule).forEach(
        ([day, schedule]) => {
          console.log(
            `요일 ${day} (${dayToKorean(day)}):`,
            schedule.is_day_off ? "휴무일" : "영업일"
          );
        }
      );

      // 실제로 토요일이 SATURDAY로, 일요일이 SUNDAY로 정확히 매핑되는지 확인
      console.log("=== 달력의 각 날짜별 요일 매핑 검증 ===");

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = addDays(firstDayOfMonth, i);
        const dayOfWeek = getDayOfWeekString(currentDate);
        const koreanDay = getDayOfWeekKorean(currentDate);
        const daySchedule = monthlySchedule.weekly_schedule[dayOfWeek];

        // 매핑 로직 확인을 위한 상세 출력
        console.log(
          `날짜: ${format(currentDate, "yyyy-MM-dd")}, ` +
            `JS요일번호: ${getDay(currentDate)}, ` +
            `조정된요일번호: ${getAdjustedDayNumber(currentDate)}, ` +
            `요일: ${dayOfWeek}, ` +
            `한글요일: ${koreanDay}, ` +
            `요일검증: ${
              dayOfWeek === "SATURDAY"
                ? "토요일맞음"
                : dayOfWeek === "SUNDAY"
                ? "일요일맞음"
                : ""
            }, ` +
            `휴무일 여부: ${daySchedule?.is_day_off ? "휴무" : "영업"}`
        );

        // 이 날짜가 주간 스케줄에서 휴무일로 지정되어 있는지 확인
        if (daySchedule && daySchedule.is_day_off) {
          // 이미 추가된 날짜는 중복 추가하지 않음
          const formattedDate = format(currentDate, "yyyy-MM-dd");
          if (
            !disabledDatesArray.some(
              (date) => format(date, "yyyy-MM-dd") === formattedDate
            )
          ) {
            disabledDatesArray.push(currentDate);
          }
        }
      }
    }

    return disabledDatesArray;
  }, [monthlySchedule, currentYearMonth]);

  // 타일 클래스 계산
  const getTileClassName = ({ date }: { date: Date }) => {
    if (!monthlySchedule) return "";

    const dateStr = format(date, "yyyy-MM-dd");
    const availability = monthlySchedule.availability_by_date[dateStr];

    // 해당 날짜에 대한 정보가 없고 주간 스케줄이 있는 경우 주간 스케줄 확인
    if (!availability && monthlySchedule.weekly_schedule) {
      const dayOfWeek = getDayOfWeekString(date);
      const daySchedule = monthlySchedule.weekly_schedule[dayOfWeek];

      // 디버깅 출력
      console.log(
        `타일 클래스 - 날짜: ${dateStr}, ` +
          `JS요일번호: ${getDay(date)}, ` +
          `조정된요일번호: ${getAdjustedDayNumber(date)}, ` +
          `요일: ${dayOfWeek}, ` +
          `휴무일: ${daySchedule?.is_day_off}`
      );

      if (daySchedule && daySchedule.is_day_off) {
        return "bg-gray-200 text-gray-400"; // 휴무일
      }

      return ""; // 일반 날짜
    }

    if (!availability) return "";

    if (availability.is_day_off) {
      return "bg-gray-200 text-gray-400"; // 휴무일
    }

    if (availability.has_reservations) {
      return "bg-yellow-100"; // 일부 예약있음
    }

    return "bg-green-100"; // 가능한 날짜
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext(selectedDate, selectedTime);
    }
  };

  if (showNoAvailability && selectedDate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">예약 불가</h2>
          <p className="text-gray-600 mb-6">
            선택하신 날짜({format(selectedDate, "yyyy년 MM월 dd일")})에는 예약
            가능한 시간이 없습니다.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectedDate(null);
                setShowNoAvailability(false);
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              다른 날짜 선택
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
            >
              이전으로
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          날짜 및 시간 선택
        </h2>

        <div className="mb-6">
          {isLoadingCalendar ? (
            <div className="h-72 flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
              <span className="ml-3">캘린더 로딩 중...</span>
            </div>
          ) : (
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  handleDateSelect(value);
                }
              }}
              value={selectedDate}
              minDate={new Date()}
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  setCalendarDate(activeStartDate);
                }
              }}
              tileDisabled={({ date }) =>
                disabledDates.some((disabledDate) =>
                  isSameDay(disabledDate, date)
                )
              }
              tileClassName={getTileClassName}
              className="rounded-lg border shadow-sm"
            />
          )}
        </div>

        {isLoadingTimes && (
          <div className="flex justify-center my-8">
            <div className="w-6 h-6 border-2 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
            <span className="ml-2">시간 불러오는 중...</span>
          </div>
        )}

        {selectedDate && !isLoadingTimes && !showNoAvailability && (
          <div className="space-y-4">
            {availableTimeSlots.morning.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-700">오전</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableTimeSlots.morning.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg border ${
                        selectedTime === time
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-violet-500"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}

            {availableTimeSlots.afternoon.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mt-6">
                  오후
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableTimeSlots.afternoon.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg border ${
                        selectedTime === time
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-violet-500"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedDate || !selectedTime}
            className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
              selectedDate && selectedTime
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음으로
          </button>
        </div>
      </div>
    </motion.div>
  );
}
