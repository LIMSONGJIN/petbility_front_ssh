import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

export default function StyledCalendar({
  date,
  setDate,
}: {
  date: Date | null;
  setDate: (date: Date) => void;
}) {
  return (
    <motion.div
      className="w-full bg-white shadow-md rounded-lg p-4 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Calendar
        onChange={(newDate) => setDate(newDate as Date)}
        value={date}
        minDate={new Date()}
        className="custom-calendar"
        tileClassName={({ date, view }) => {
          const today = new Date();
          if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          ) {
            return "today";
          }
          return "";
        }}
      />
    </motion.div>
  );
}
