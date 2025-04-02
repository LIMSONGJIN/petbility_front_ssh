export interface Service {
  service_id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  available_time?: Record<string, [string, string]>;
  location: string;
  latitude: number;
  longitude: number;
  is_deleted: boolean;
  category: string;
  avg_rating: number;
  review_count: number;
  likes: number;
  pending_count: number;
  confirmed_count: number;
  canceled_count: number;
  created_at: string;
  updated_at: string;
}
