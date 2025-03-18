import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useCart() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  return { cartItems };
}
