"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { salesApi } from "@/api/business";
import { SalesData } from "@/types/business";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  period: "week" | "month";
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const today = new Date();
        const startDate = new Date();

        if (period === "week") {
          startDate.setDate(today.getDate() - 7);
        } else {
          startDate.setMonth(today.getMonth() - 1);
        }

        const data = await salesApi.getSalesData({
          start: startDate.toISOString().split("T")[0],
          end: today.toISOString().split("T")[0],
        });
        setSalesData(data);
      } catch (error) {
        console.error("Failed to load sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalesData();
  }, [period]);

  const chartData = {
    labels: salesData.map((item) => {
      const date = new Date(item.date);
      return period === "week"
        ? ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
        : `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }),
    datasets: [
      {
        label: "매출",
        data: salesData.map((item) => item.total_amount),
        borderColor: "rgb(124, 58, 237)",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `₩${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `₩${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[300px] flex items-center justify-center"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[300px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
