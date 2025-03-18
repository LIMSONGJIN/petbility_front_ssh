import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import reservationsReducer from "./slices/reservationsSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    reservations: reservationsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
