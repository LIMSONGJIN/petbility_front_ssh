import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "@/api/axios";

interface CreateReservationInput {
  service_id: string;
  pet_id: string;
  reserved_at: string;
  notes?: string;
}

export const useCreateReservation = () => {
  return useMutation({
    mutationFn: async (data: CreateReservationInput) => {
      const res = await axios.post("/reservations", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("예약이 완료되었습니다!");
    },
    onError: () => {
      toast.error("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};
