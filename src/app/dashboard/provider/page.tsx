"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/RouteGuard";
import { api } from "@/lib/axios";
import { Service, Booking, Category, BookingStatus } from "@/types";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";
import { Plus, Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ProviderDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "bookings">("services");

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submittingService, setSubmittingService] = useState(false);

  const fetchData = async () => {
    try {
      const [srvRes, bkkRes, catRes] = await Promise.all([
        api.get("/services"),
        api.get("/bookings"),
        api.get("/categories"),
      ]);
      setCategories(catRes.data.data);
      // Filter services for current provider or all if admin
      setServices(srvRes.data.data);
      setBookings(bkkRes.data.data);
    } catch (err) {
      console.error("Failed to load provider dashboard data", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateService = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setDuration("");
    setLocation("");
    setCategoryId(categories[0]?.id || "");
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(String(service.price));
    setDuration(service.duration ? String(service.duration) : "");
    setLocation(service.location || "");
    setCategoryId(service.categoryId);
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingService(true);
      const payload = {
        title,
        description,
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : undefined,
        location: location.trim() || undefined,
        categoryId,
      };

      if (editingService) {
        await api.patch(`/services/${editingService.id}`, payload);
        toast.success("Service updated successfully!");
      } else {
        await api.post("/services", payload);
        toast.success("Service created successfully!");
      }

      setServiceModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete service");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update booking status");
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
    <RouteGuard allowedRoles={["PROVIDER", "ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Manage your service catalog and incoming customer bookings</p>
          </div>
          {activeTab === "services" && (
            <Button onClick={handleOpenCreateService} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New Service
            </Button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "services"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            My Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Incoming Bookings ({bookings.length})
          </button>
        </div>

        {/* Tab Content: Services */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const priceNum = typeof service.price === "string" ? parseFloat(service.price) : service.price;
              return (
                <div key={service.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      {service.category && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                          {service.category.name}
                        </span>
                      )}
                      <span className="text-lg font-bold text-slate-900">৳{priceNum?.toLocaleString()}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{service.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      {service.location && <span>📍 {service.location}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditService(service)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content: Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-sm text-slate-500">No incoming bookings found.</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const service = booking.service;
                const priceNum = typeof booking.totalPrice === "string" ? parseFloat(booking.totalPrice) : booking.totalPrice;
                const schedDate = new Date(booking.scheduledDate).toLocaleString();

                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge status={booking.status} />
                        <span className="text-xs text-slate-400">Customer ID: {booking.customerId}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {service?.title || "Service Booking"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>Scheduled: {schedDate}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                          <span className="font-semibold">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
                        <p className="text-xl font-extrabold text-slate-900">৳{priceNum?.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === "PENDING" && (
                          <Button size="sm" onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}>
                            Accept
                          </Button>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateBookingStatus(booking.id, "COMPLETED")}>
                            Complete
                          </Button>
                        )}
                        {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                          <Button size="sm" variant="danger" onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Service Create/Edit Modal */}
        <Modal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          title={editingService ? "Edit Service" : "Create New Service"}
        >
          <form onSubmit={handleSaveService} className="space-y-4">
            <Input
              label="Service Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Premium Home Deep Cleaning"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed service description..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (৳)"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
              />
            </div>

            <Input
              label="Location (Optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setServiceModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={submittingService}>
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </RouteGuard>
  );
}
