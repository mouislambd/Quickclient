"use client";

import React, { useEffect, useState } from "react";
import { RouteGuard } from "@/components/RouteGuard";
import { api } from "@/lib/axios";
import { Booking } from "@/types";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Calendar, Clock, MapPin, Star, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenReview = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setRating(5);
    setComment("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      await api.post("/reviews", {
        serviceId: selectedServiceId,
        rating: Number(rating),
        comment: comment.trim() || undefined,
      });
      toast.success("Review submitted successfully!");
      setReviewModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <RouteGuard allowedRoles={["CUSTOMER"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-600 text-sm mt-1">Manage and track your service appointments</p>
          </div>
          <Link href="/services">
            <Button>Book New Service</Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              📅
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bookings found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't booked any services yet. Explore our catalog and book your first service today!
            </p>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const service = booking.service;
              const priceNum = typeof booking.totalPrice === "string" ? parseFloat(booking.totalPrice) : booking.totalPrice;
              const schedDate = new Date(booking.scheduledDate).toLocaleString();

              return (
                <div key={booking.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge status={booking.status} />
                      <span className="text-xs text-slate-400">Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {service?.title || "Service Appointment"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Scheduled: {schedDate}</span>
                      </div>
                      {service?.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{service.location}</span>
                        </div>
                      )}
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-700">Notes:</span> {booking.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Total Price</span>
                      <p className="text-2xl font-extrabold text-slate-900">৳{priceNum?.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/services/${booking.serviceId}`}>
                        <Button variant="outline" size="sm">View Service</Button>
                      </Link>
                      {booking.status === "COMPLETED" && (
                        <Button variant="secondary" size="sm" onClick={() => handleOpenReview(booking.serviceId)}>
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Leave a Review">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 - Excellent ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 - Good ⭐⭐⭐⭐</option>
                <option value={3}>3 - Average ⭐⭐⭐</option>
                <option value={2}>2 - Poor ⭐⭐</option>
                <option value={1}>1 - Terrible ⭐</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={submittingReview}>
                Submit Review
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </RouteGuard>
  );
}
