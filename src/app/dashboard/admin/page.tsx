"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/RouteGuard";
import { api } from "@/lib/axios";
import { Category, User, Service, Booking } from "@/types";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { Plus, Edit, Trash2, Users, Wrench, Calendar, Layers } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "users" | "services" | "bookings">("categories");

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const fetchData = async () => {
    try {
      const [catRes, usrRes, srvRes, bkkRes] = await Promise.all([
        api.get("/categories"),
        api.get("/users"),
        api.get("/services"),
        api.get("/bookings"),
      ]);
      setCategories(catRes.data.data);
      setUsers(usrRes.data.data);
      setServices(srvRes.data.data);
      setBookings(bkkRes.data.data);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIcon("");
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIcon(cat.icon || "");
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingCategory(true);
      const payload = {
        name,
        description: description.trim() || undefined,
        icon: icon.trim() || undefined,
      };

      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, payload);
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created successfully!");
      }

      setCategoryModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Platform management: categories, users, services, and bookings</p>
          </div>
          {activeTab === "categories" && (
            <Button onClick={handleOpenCreateCategory} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Category
            </Button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "categories"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "services"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">
                    {cat.icon || "📂"}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                    {cat.description && <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4"><Badge status={u.role} /></td>
                      <td className="p-4 text-slate-600">{u.phone || "N/A"}</td>
                      <td className="p-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((s) => {
                    const priceNum = typeof s.price === "string" ? parseFloat(s.price) : s.price;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-semibold text-slate-900">{s.title}</td>
                        <td className="p-4 text-slate-600">{s.category?.name || "N/A"}</td>
                        <td className="p-4 font-bold text-slate-900">৳{priceNum?.toLocaleString()}</td>
                        <td className="p-4 text-slate-600">{s.location || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                    <th className="p-4 font-semibold">Service</th>
                    <th className="p-4 font-semibold">Customer ID</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Scheduled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => {
                    const priceNum = typeof b.totalPrice === "string" ? parseFloat(b.totalPrice) : b.totalPrice;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-semibold text-slate-900">{b.service?.title || "Booking"}</td>
                        <td className="p-4 text-xs font-mono text-slate-500">{b.customerId}</td>
                        <td className="p-4"><Badge status={b.status} /></td>
                        <td className="p-4 font-bold text-slate-900">৳{priceNum?.toLocaleString()}</td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(b.scheduledDate).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category Create/Edit Modal */}
        <Modal
          isOpen={categoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          title={editingCategory ? "Edit Category" : "Create New Category"}
        >
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <Input
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Appliance Repair"
              required
            />
            <Input
              label="Icon (Emoji or symbol)"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🔌"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={submittingCategory}>
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </RouteGuard>
  );
}
