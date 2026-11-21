
import type { LucideIcon } from "lucide-react";

export type TUserRole = "customer" | "technician" | "admin";

export type TServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type TServiceMode = "Home Visit" | "Shop Drop-off";

export type TApprovalStatus = "pending" | "approved" | "rejected";

export type TService = {
  _id: string;
  title: string;
  category: TServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: TServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: TApprovalStatus;
  isAvailable: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
};

export type TServiceField =
  | "title"
  | "category"
  | "description"
  | "image"
  | "basePrice"
  | "estimatedDuration"
  | "serviceMode"
  | "serviceArea";

export type TServiceFormState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<TServiceField, string>>;
  values?: Partial<Record<TServiceField, string>>;
};

export type TCommonApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type TUser = {
  name: string;
  email: string;
  image?: string | null;
  role?: TUserRole | null;
};

export type TAdminUser = {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  image?: string | null;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string | Date;
  emailVerified?: boolean;
};

export type TDashboardSidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: TUserRole[];
};
