"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Wrench, Menu, X, User, LogOut, LayoutDashboard, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "./Badge";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">QuickServe</span>
              <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-widest">On-Demand Services</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Services
            </Link>

            {user && (
              <>
                {user.role === "CUSTOMER" && (
                  <Link href="/dashboard/bookings" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> My Bookings
                  </Link>
                )}
                {user.role === "PROVIDER" && (
                  <Link href="/dashboard/provider" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" /> Provider Dashboard
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link href="/dashboard/admin" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <Badge status={user.role} />
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Services
          </Link>

          {user && (
            <>
              {user.role === "CUSTOMER" && (
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  My Bookings
                </Link>
              )}
              {user.role === "PROVIDER" && (
                <Link
                  href="/dashboard/provider"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Provider Dashboard
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between px-3">
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <Badge status={user.role} />
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 text-rose-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
