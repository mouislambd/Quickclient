"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/types";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: Role }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("quickserve_token");
    const storedUser = localStorage.getItem("quickserve_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("quickserve_token");
        localStorage.removeItem("quickserve_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { user: loggedInUser, token: authToken } = res.data.data;
      
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem("quickserve_token", authToken);
      localStorage.setItem("quickserve_user", JSON.stringify(loggedInUser));
      
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      
      // Redirect based on role
      if (loggedInUser.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (loggedInUser.role === "PROVIDER") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/bookings");
      }
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: Role }): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", data);
      const { user: registeredUser, token: authToken } = res.data.data;

      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem("quickserve_token", authToken);
      localStorage.setItem("quickserve_user", JSON.stringify(registeredUser));

      toast.success("Account created successfully!");

      if (registeredUser.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (registeredUser.role === "PROVIDER") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/bookings");
      }
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("quickserve_token");
    localStorage.removeItem("quickserve_user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/users/${user.id}`);
      setUser(res.data.data);
      localStorage.setItem("quickserve_user", JSON.stringify(res.data.data));
    } catch (e) {
      console.error("Failed to refresh user", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
