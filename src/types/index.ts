export type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number | string;
  duration?: number;
  location?: string;
  categoryId: string;
  category?: Category;
  providerId: string;
  provider?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  service?: Service;
  customerId: string;
  customer?: User;
  status: BookingStatus;
  scheduledDate: string;
  notes?: string;
  totalPrice: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  serviceId: string;
  service?: Service;
  customerId: string;
  customer?: User;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
