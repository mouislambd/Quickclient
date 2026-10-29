"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Role } from "@/types";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await register({
      name,
      email,
      password,
      phone: phone.trim() || undefined,
      role,
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-blue-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-sm text-slate-500">Join QuickServe as a customer or service provider</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

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
            placeholder="At least 6 characters"
            required
          />

          <Input
            label="Phone Number (Optional)"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+8801700000000"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">Customer (Book services)</option>
              <option value="PROVIDER">Service Provider (Offer services)</option>
            </select>
          </div>

          <Button type="submit" isLoading={submitting} className="w-full py-2.5">
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
