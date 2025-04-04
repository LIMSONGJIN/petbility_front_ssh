import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
      <p className="text-gray-600 mt-2">
        오늘의 예약 현황과 매출을 한눈에 확인하세요.
      </p>
    </motion.div>
  );
}
