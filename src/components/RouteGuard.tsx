"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types";
import { Spinner } from "./Spinner";
import { useRouter } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "ADMIN") router.push("/dashboard/admin");
        else if (user.role === "PROVIDER") router.push("/dashboard/provider");
        else router.push("/dashboard/bookings");
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
