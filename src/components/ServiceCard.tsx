import React from "react";
import { Service } from "@/types";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
  cacheStatus?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, cacheStatus }) => {
  const priceNum = typeof service.price === "string" ? parseFloat(service.price) : service.price;

  return (
    <Card hoverEffect className="flex flex-col h-full overflow-hidden">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          {service.category && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {service.category.name}
            </span>
          )}
          {cacheStatus && <Badge type="cache">{cacheStatus}</Badge>}
        </div>

        <Link href={`/services/${service.id}`} className="group">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-lg mb-1">
            {service.title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
          {service.description}
        </p>

        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
          {service.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{service.location}</span>
            </div>
          )}
          {service.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{service.duration} mins</span>
            </div>
          )}
          {service.provider && (
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <span>By {service.provider.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900">
          ৳{priceNum?.toLocaleString()}
        </div>
        <Link
          href={`/services/${service.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
};
