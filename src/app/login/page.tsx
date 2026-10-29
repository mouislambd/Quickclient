"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Wrench, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@1234");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-blue-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to your QuickServe account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" isLoading={submitting} className="w-full py-2.5">
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create account
          </Link>
        </div>

        {/* Demo Credentials Helper Card */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
            Demo Credentials (Click to fill)
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo("admin@quickserve.demo")}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg font-medium text-left transition-colors flex items-center justify-between"
            >
              <span>👑 Admin: admin@quickserve.demo</span>
              <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded">Fill</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("provider1@quickserve.demo")}
              className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg font-medium text-left transition-colors flex items-center justify-between"
            >
              <span>🛠️ Provider: provider1@quickserve.demo</span>
              <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded">Fill</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("customer1@quickserve.demo")}
              className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg font-medium text-left transition-colors flex items-center justify-between"
            >
              <span>👤 Customer: customer1@quickserve.demo</span>
              <span className="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded">Fill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
