import { apiClient } from "@/lib/api-client";
import type {
  User,
  Pet,
  Service,
  Reservation,
  Notification,
} from "@/types/api";

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; name: string }) =>
    apiClient.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    apiClient.post("/auth/refresh", { refreshToken }),
};

// User API
export const userAPI = {
  getMe: () => apiClient.get<User>("/users/me"),
  updateMe: (data: Partial<User>) => apiClient.patch("/users/me", data),
  updateLocation: (data: { latitude: number; longitude: number }) =>
    apiClient.patch("/users/me/location", data),
  deleteMe: () => apiClient.delete("/users/me"),
};

// Pet API
export const petAPI = {
  create: (
    data: Omit<Pet, "pet_id" | "user_id" | "created_at" | "updated_at">
  ) => apiClient.post<Pet>("/users/pets", data),
  getAll: () => apiClient.get<Pet[]>("/users/pets"),
  getOne: (id: string) => apiClient.get<Pet>(`/users/pets/${id}`),
  update: (id: string, data: Partial<Pet>) =>
    apiClient.patch<Pet>(`/users/pets/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/pets/${id}`),
};

// Reservation API
export const reservationAPI = {
  create: (data: {
    service_id: string;
    pet_id: string;
    reserved_at: string;
    notes?: string;
  }) => apiClient.post<Reservation>("/reservations", data),
  getMine: () => apiClient.get<Reservation[]>("/reservations/me"),
  getOne: (id: string) => apiClient.get<Reservation>(`/reservations/${id}`),
  cancel: (id: string) =>
    apiClient.patch<Reservation>(`/reservations/${id}/cancel`),
  getAvailableTimes: (serviceId: string, date: string) =>
    apiClient.get<string[]>(`/reservations/available/times`, {
      params: { service_id: serviceId, date },
    }),
  getDisabledDates: (serviceId: string) =>
    apiClient.get<string[]>(`/reservations/available/disabled-dates`, {
      params: { service_id: serviceId },
    }),
};

// Business API
export const businessAPI = {
  getServices: () => apiClient.get<Service[]>("/business/services"),
  createService: (
    data: Omit<Service, "service_id" | "admin_id" | "created_at" | "updated_at">
  ) => apiClient.post<Service>("/business/services", data),
  getService: (id: string) =>
    apiClient.get<Service>(`/business/services/${id}`),
  updateService: (id: string, data: Partial<Service>) =>
    apiClient.patch<Service>(`/business/services/${id}`, data),
  deleteService: (id: string) => apiClient.delete(`/business/services/${id}`),
  getReservations: () => apiClient.get<Reservation[]>("/business/reservations"),
  getReservation: (id: string) =>
    apiClient.get<Reservation>(`/business/reservations/${id}`),
  updateReservationStatus: (id: string, status: string) =>
    apiClient.patch<Reservation>(`/reservations/${id}/status`, { status }),
};

// Notification API
export const notificationAPI = {
  getAll: (unreadOnly?: boolean) =>
    apiClient.get<Notification[]>("/notifications", {
      params: { unreadOnly },
    }),
  getUnreadCount: () => apiClient.get<number>("/notifications/unread-count"),
  markAsRead: (id: string) =>
    apiClient.patch<Notification>(`/notifications/${id}/read`),
  markAllAsRead: () =>
    apiClient.patch<Notification[]>("/notifications/read-all"),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
};
