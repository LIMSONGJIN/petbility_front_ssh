import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ReservationFiltersProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
}

export default function ReservationFilters({
  onSearchChange,
  onStatusChange,
}: ReservationFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="검색..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="px-4 py-2 border rounded-md"
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">전체</option>
        <option value="pending">대기 중</option>
        <option value="confirmed">확정됨</option>
        <option value="completed">완료됨</option>
        <option value="cancelled">취소됨</option>
      </select>
    </div>
  );
}
