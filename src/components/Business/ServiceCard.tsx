"use client";

import { Service } from "@/types/service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: Service;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <Badge variant={service.is_deleted ? "default" : "secondary"}>
            {service.is_deleted ? "진열 중" : "비공개"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          카테고리: {service.category} / 가격: {service.price.toLocaleString()}
          원
        </p>
        <p className="text-sm line-clamp-2 text-gray-600">
          {service.description}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              수정
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              삭제
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
