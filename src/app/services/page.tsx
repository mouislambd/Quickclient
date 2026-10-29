"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Category, Service } from "@/types";
import { ServiceCard } from "@/components/ServiceCard";
import { Spinner } from "@/components/Spinner";
import { Search, Filter, RefreshCcw } from "lucide-react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryQuery = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [searchKeyword, setSearchKeyword] = useState(searchQuery);

  useEffect(() => {
    setSelectedCategory(categoryQuery);
    setSearchKeyword(searchQuery);
  }, [categoryQuery, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        
        const res = await api.get("/services", { params });
        let items: Service[] = res.data.data;

        // Capture X-Cache header
        const xCache = (res as any).xCache || res.headers["x-cache"] || "MISS";
        setCacheStatus(xCache);

        // Filter by keyword locally if present
        if (searchKeyword.trim()) {
          const kw = searchKeyword.toLowerCase();
          items = items.filter(
            (s) =>
              s.title.toLowerCase().includes(kw) ||
              s.description.toLowerCase().includes(kw) ||
              (s.location && s.location.toLowerCase().includes(kw))
          );
        }

        setServices(items);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchKeyword]);

  const handleFilterChange = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams();
    if (catId) params.set("category", catId);
    if (searchKeyword) params.set("search", searchKeyword);
    router.push(`/services?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (searchKeyword) params.set("search", searchKeyword);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Services</h1>
          <p className="text-slate-600 text-sm mt-1">Browse and book professional services for your home and needs</p>
        </div>
        {cacheStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">API Cache Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                cacheStatus === "HIT"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              {cacheStatus}
            </span>
          </div>
        )}
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </form>

        {/* Category Pills */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => handleFilterChange("")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Service List */}
      {loading ? (
        <div className="py-24">
          <Spinner size="lg" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No services found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setSearchKeyword("");
              router.push("/services");
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} cacheStatus={cacheStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="py-24 flex justify-center"><Spinner size="lg" /></div>}>
      <ServicesContent />
    </Suspense>
  );
}
