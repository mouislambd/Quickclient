"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { Service, Review } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/Spinner";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { MapPin, Clock, Star, Calendar, User as UserIcon, CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

function ServiceDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<string>("");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const [srvRes, revRes] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/reviews/service/${id}`),
        ]);
        setService(srvRes.data.data);
        setReviews(revRes.data.data);

        const srvCache = (srvRes as any).xCache || srvRes.headers["x-cache"] || "MISS";
        setCacheStatus(srvCache);
      } catch (err) {
        console.error("Failed to load service details", err);
        toast.error("Service not found");
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchServiceData();
  }, [id, router]);

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login as a customer to book a service");
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can book services");
      return;
    }
    if (!scheduledDate) {
      toast.error("Please select a scheduled date and time");
      return;
    }

    try {
      setBookingLoading(true);
      const priceNum = service ? (typeof service.price === "string" ? parseFloat(service.price) : service.price) : 0;
      
      const payload = {
        serviceId: id,
        scheduledDate: new Date(scheduledDate).toISOString(),
        notes: notes.trim() || undefined,
        totalPrice: priceNum,
      };

      await api.post("/bookings", payload);
      toast.success("Service booked successfully!");
      setBookingModalOpen(false);
      router.push("/dashboard/bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book service");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "CUSTOMER") {
      toast.error("Only customers can leave reviews");
      return;
    }

    try {
      setReviewLoading(true);
      const payload = {
        serviceId: id,
        rating: Number(rating),
        comment: comment.trim() || undefined,
      };
      await api.post("/reviews", payload);
      toast.success("Review submitted successfully!");
      setReviewModalOpen(false);
      setComment("");

      // Refresh reviews
      const revRes = await api.get(`/reviews/service/${id}`);
      setReviews(revRes.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!service) return null;

  const priceNum = typeof service.price === "string" ? parseFloat(service.price) : service.price;
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "No rating";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                {service.category && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                    {service.category.name}
                  </span>
                )}
                <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{service.title}</h1>
              </div>
              {cacheStatus && <Badge type="cache">{cacheStatus}</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pt-4 border-t border-slate-100">
              {service.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{service.location}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{service.duration} mins</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{avgRating} ({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-semibold text-slate-900 text-lg">Service Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {service.provider && (
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                    {service.provider.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Service Provider</p>
                    <p className="text-base font-semibold text-slate-900">{service.provider.name}</p>
                    <p className="text-xs text-slate-500">{service.provider.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
                <p className="text-sm text-slate-500">Real feedback from verified customers</p>
              </div>
              {user && user.role === "CUSTOMER" && (
                <Button onClick={() => setReviewModalOpen(true)} variant="outline" size="sm">
                  Write a Review
                </Button>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No reviews yet for this service.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {rev.customer?.name?.charAt(0) || "C"}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{rev.customer?.name || "Customer"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.comment && <p className="text-sm text-slate-600 pl-10">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Card Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Price</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">৳{priceNum?.toLocaleString()}</div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified professional expert</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Satisfaction guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Secure online booking</span>
              </div>
            </div>

            <Button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to book this service");
                  router.push("/login");
                  return;
                }
                if (user.role !== "CUSTOMER") {
                  toast.error("Only customers can book services");
                  return;
                }
                setBookingModalOpen(true);
              }}
              className="w-full py-3 text-base"
            >
              Book Service Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} title="Book Service">
        <form onSubmit={handleBookService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Special Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific instructions for the provider..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Total Price</p>
              <p className="text-lg font-bold text-slate-900">৳{priceNum?.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={bookingLoading}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a Review">
        <form onSubmit={handleCreateReview} className="space-y-4">
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
              placeholder="Share your experience with this service..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={reviewLoading}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<div className="py-24 flex justify-center"><Spinner size="lg" /></div>}>
      <ServiceDetailContent />
    </Suspense>
  );
}
