"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  Calendar,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SalesData, SalesSummary } from "@/types/business";
import { salesApi } from "@/api/business";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function BusinessSales() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [data, summary] = await Promise.all([
          salesApi.getSalesData({
            start: "",
            end: "",
            range: timeRange,
          } as any),
          salesApi.getSalesSummary({
            start: "",
            end: "",
            range: timeRange,
          } as any),
        ]);
        setSalesData(data);
        setSalesSummary(summary);
      } catch (err) {
        toast.error("매출 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  if (isLoading || !salesSummary) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">로딩 중...</div>
      </div>
    );
  }

  const chartData = salesData.map((d) => ({
    date: format(new Date(d.date), "MM.dd", { locale: ko }),
    total: d.total_amount,
    card: d.payment_methods.find((m) => m.method === "card")?.amount || 0,
    cash: d.payment_methods.find((m) => m.method === "cash")?.amount || 0,
  }));

  const lineChartData = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "총 매출",
        data: chartData.map((d) => d.total),
        borderColor: "rgb(124, 58, 237)",
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: salesSummary.service_sales.map((s) => s.service_name),
    datasets: [
      {
        label: "서비스별 매출",
        data: salesSummary.service_sales.map((s) => s.amount),
        backgroundColor: "rgba(124, 58, 237, 0.8)",
      },
    ],
  };

  const pieChartData = {
    labels: salesSummary.payment_methods.map((p) =>
      p.method === "card" ? "카드" : "현금"
    ),
    datasets: [
      {
        data: salesSummary.payment_methods.map((p) => p.amount),
        backgroundColor: COLORS,
      },
    ],
  };

  const currency = (n: number) => `${n.toLocaleString()}원`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 상단 통계 카드 */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">총 매출</h2>
              </div>
              <div className="text-2xl font-bold">
                {currency(salesSummary.total_sales)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">평균 매출</h2>
              </div>
              <div className="text-2xl font-bold">
                {currency(salesSummary.average_sales)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">카드 매출</h2>
              </div>
              <div className="text-2xl font-bold">
                {currency(
                  salesSummary.payment_methods.find((m) => m.method === "card")
                    ?.amount || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold">현금 매출</h2>
              </div>
              <div className="text-2xl font-bold">
                {currency(
                  salesSummary.payment_methods.find((m) => m.method === "cash")
                    ?.amount || 0
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">매출 추이</h2>
              <Line data={lineChartData} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">결제 수단별 매출</h2>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">서비스별 매출</h2>
              <Bar data={barChartData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
