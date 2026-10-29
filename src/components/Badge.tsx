import React from "react";
import { BookingStatus } from "@/types";

interface BadgeProps {
  status?: BookingStatus | string;
  type?: "status" | "cache" | "role";
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, type = "status", children, className = "" }) => {
  if (type === "cache") {
    const isHit = children === "HIT" || status === "HIT";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isHit ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
        } ${className}`}
      >
        Cache: {children || status}
      </span>
    );
  }

  const statusMap: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    CANCELLED: "bg-rose-50 text-rose-700 border border-rose-200",
    ADMIN: "v bg-purple-50 text-purple-700 border border-purple-200",
    PROVIDER: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    CUSTOMER: "bg-sky-50 text-sky-700 border border-sky-200",
  };

  const key = (status || "").toString().toUpperCase();
  const badgeStyle = statusMap[key] || "bg-slate-100 text-slate-700 border border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle} ${className}`}>
      {children || status}
    </span>
  );
};
