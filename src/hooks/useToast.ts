import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useToast() {
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    toast[type](message, { position: "top-right", autoClose: 3000 });
  };

  return { showToast };
}
