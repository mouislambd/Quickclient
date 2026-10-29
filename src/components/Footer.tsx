import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">QuickServe</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Your trusted platform for professional on-demand home services, repairs, tutoring, and beauty care. Book verified experts instantly.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Browse Services</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services?category=home-cleaning" className="hover:text-white transition-colors">Home Cleaning</Link></li>
              <li><Link href="/services?category=plumbing" className="hover:text-white transition-colors">Plumbing Services</Link></li>
              <li><Link href="/services?category=electrical" className="hover:text-white transition-colors">Electrical Repairs</Link></li>
              <li><Link href="/services?category=ac-repair" className="hover:text-white transition-colors">AC Repair & Servicing</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; 2026 QuickServe Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Powered by QuickServe API & Next.js App Router</p>
        </div>
      </div>
    </footer>
  );
};
