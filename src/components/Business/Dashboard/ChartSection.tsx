"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import RevenueChart from "./RevenueChart";
import ServicePerformance from "./ServicePerformance";

export default function ChartSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">매출 현황</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedPeriod === "week"
                  ? "bg-violet-100 text-violet-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedPeriod === "month"
                  ? "bg-violet-100 text-violet-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              월간
            </button>
          </div>
        </div>
        <RevenueChart period={selectedPeriod} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          서비스별 성과
        </h2>
        <ServicePerformance />
      </motion.div>
    </div>
  );
}
