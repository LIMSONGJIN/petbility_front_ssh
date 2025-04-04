"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { statsApi } from "@/api/business";
import { BusinessStats } from "@/types/business";

export default function DashboardStats() {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsApi.getBusinessStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load business stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsData = [
    {
      title: "총 예약",
      value: stats?.total_reservations || "0",
      change: "+2",
      icon: <Calendar className="w-6 h-6 text-violet-600" />,
      color: "violet",
    },
    {
      title: "총 매출",
      value: stats?.total_sales
        ? `₩${stats.total_sales.toLocaleString()}`
        : "₩0",
      change: "+15%",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: "green",
    },
    {
      title: "총 고객",
      value: stats?.total_customers || "0",
      change: "+3",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: "blue",
    },
    {
      title: "총 서비스",
      value: stats?.total_services || "0",
      change: "+1",
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      color: "yellow",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-gray-50">{stat.icon}</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">{stat.change}</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
