// components/ClientCalendar.tsx
"use client";

import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

export default Calendar;
