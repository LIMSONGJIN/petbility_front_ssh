import { ServiceCategory } from "@/constants/service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface ServiceCardProps {
  category: ServiceCategory;
  isActive: boolean;
  serviceId?: string;
  onToggle: () => void;
  isUpdating?: boolean;
}

export function ServiceCard({
  category,
  isActive,
  serviceId,
  onToggle,
  isUpdating = false,
}: ServiceCardProps) {
  return (
    <Card
      className={`relative overflow-hidden ${
        isActive ? "border-violet-500" : "border-gray-200"
      }`}
    >
      <div
        className={`absolute top-0 right-0 p-2 ${
          isActive ? "bg-violet-500" : "bg-gray-200"
        }`}
      >
        {isUpdating ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : isActive ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <Circle className="w-5 h-5 text-white" />
        )}
      </div>

      <CardContent className="p-6 bg-white h-full flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">{category.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
          {serviceId && (
            <p className="text-xs text-gray-400 mt-1">ID: {serviceId}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              isActive ? "text-violet-600" : "text-gray-500"
            }`}
          >
            {isUpdating
              ? "업데이트 중..."
              : isActive
              ? "운영 중"
              : "운영하지 않음"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={
              isActive
                ? "text-red-500 hover:text-red-600"
                : "text-violet-500 hover:text-violet-600"
            }
            disabled={!serviceId || isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isActive ? "운영 중지" : "운영 시작"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
