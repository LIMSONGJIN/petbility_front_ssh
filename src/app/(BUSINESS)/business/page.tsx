"use client";

import DashboardHeader from "@/components/Business/Dashboard/DashboardHeader";
import DashboardStats from "@/components/Business/Dashboard/DashboardStats";
import ChartSection from "@/components/Business/Dashboard/ChartSection";
import RecentReservations from "@/components/Business/Dashboard/RecentReservations";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <DashboardStats />
        <ChartSection />
        <RecentReservations />
      </div>
    </div>
  );
}
