"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBusinessService } from "@/api/business/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function BusinessServiceForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "funeral",
    price: 0,
    duration: 60,
    location: "",
    latitude: 0,
    longitude: 0,
    is_deleted: false,
    description: "",
    available_time: weekDays.reduce((acc, day) => {
      acc[day] = { start: "09:00", end: "18:00", enabled: false };
      return acc;
    }, {} as Record<string, { start: string; end: string; enabled: boolean }>),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeChange = (
    day: string,
    field: "start" | "end" | "enabled",
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      available_time: {
        ...prev.available_time,
        [day]: {
          ...prev.available_time[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBusinessService({
        ...form,
        price: Number(form.price),
        available_time: JSON.stringify(
          Object.fromEntries(
            Object.entries(form.available_time)
              .filter(([, v]) => v.enabled)
              .map(([k, v]) => [k, [v.start, v.end]])
          )
        ),
      });

      toast.success("서비스가 등록되었습니다.");
      router.push("/business/services");
    } catch (err: any) {
      console.error("서비스 등록 실패:", err.response?.data || err.message);
      toast.error("서비스 등록 실패");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">서비스 등록</h2>

      <div className="mb-4">
        <Label htmlFor="name">서비스 이름</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="mb-4">
        <Label htmlFor="category">카테고리</Label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="funeral">장례</option>
          <option value="grooming">미용</option>
          <option value="bathing">목욕</option>
          <option value="custom-vehicles">차량 제작</option>
          <option value="other-care">기타</option>
        </select>
      </div>

      <div className="mb-4">
        <Label htmlFor="price">가격 (원)</Label>
        <Input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="description">서비스 설명</Label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 h-24"
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">예약 가능 시간</h3>
        {weekDays.map((day) => (
          <div key={day} className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={form.available_time[day].enabled}
              onChange={(e) =>
                handleTimeChange(day, "enabled", e.target.checked)
              }
            />
            <Label className="w-12 capitalize">{day}</Label>
            <Input
              type="time"
              value={form.available_time[day].start}
              onChange={(e) => handleTimeChange(day, "start", e.target.value)}
              disabled={!form.available_time[day].enabled}
            />
            ~
            <Input
              type="time"
              value={form.available_time[day].end}
              onChange={(e) => handleTimeChange(day, "end", e.target.value)}
              disabled={!form.available_time[day].enabled}
            />
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        서비스 등록하기
      </Button>
    </form>
  );
}
