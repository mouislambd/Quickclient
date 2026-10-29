"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Category, Service } from "@/types";
import { ServiceCard } from "@/components/ServiceCard";
import { Spinner } from "@/components/Spinner";
import { Search, ShieldCheck, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          api.get("/categories"),
          api.get("/services"),
        ]);
        setCategories(catRes.data.data);
        setServices(srvRes.data.data.slice(0, 6)); // Top 6 featured services
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold backdrop-blur-md border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Verified & Trusted Professionals
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Expert Home Services, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Delivered to Your Doorstep
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Book reliable electricians, plumbers, cleaners, and beauty experts in seconds. Transparent pricing and guaranteed satisfaction.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-2xl">
            <div className="flex-1 flex items-center px-3 gap-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cleaning, plumbing, AC repair..."
                className="w-full py-2.5 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-500/20 text-sm shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center border-t border-blue-800/60">
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Verified Experts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9/5</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Customer Rating</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold text-white">Fast</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Instant Booking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-slate-600 text-sm mt-1">Find professional services tailored to your needs</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.id}`}
                className="group p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500/50 hover:shadow-lg transition-all text-center space-y-3 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon || "🛠️"}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Services</h2>
            <p className="text-slate-600 text-sm mt-1">Popular services booked by our customers</p>
          </div>
          <Link href="/services" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose QuickServe?</h2>
            <p className="text-slate-400">We make home maintenance and personal care effortless, secure, and professional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Verified Professionals</h3>
              <p className="text-sm text-slate-400">All service providers undergo strict background checks and skill verification.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Instant & Flexible Booking</h3>
              <p className="text-sm text-slate-400">Schedule services at your preferred date and time with zero hassle.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Satisfaction Guarantee</h3>
              <p className="text-sm text-slate-400">Top-tier service quality with dedicated customer support every step of the way.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
