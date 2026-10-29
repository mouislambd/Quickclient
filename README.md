# QuickServe Frontend

Complete frontend for the QuickServe On-Demand Home Services API, built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Features

1. **Authentication:** Register and Login pages, AuthContext (`user`, `token`, `login`, `logout`), session persistence on refresh, automatic redirect on 401.
2. **Role-Based Access Control (RBAC):** Route protection for `CUSTOMER`, `PROVIDER`, and `ADMIN` using reusable `RouteGuard` and dynamic navbar.
3. **Public Discovery:**
   - **Home (`/`):** Hero section, search bar, featured categories, and popular services.
   - **Services (`/services`):** Category filters, search bar, service cards, and real-time API cache status badge (`X-Cache: HIT/MISS`).
   - **Service Details (`/services/[id]`):** Comprehensive service info, provider profile, reviews list, book service modal, and customer review submission.
4. **Customer Dashboard (`/dashboard/bookings`):** View bookings with status badges (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), cancel/track bookings, and leave reviews on completed bookings.
5. **Provider Dashboard (`/dashboard/provider`):** CRUD operations for own services and incoming booking management (accept, complete, cancel).
6. **Admin Dashboard (`/dashboard/admin`):** Category management (create, edit, delete) and overview of all platform users, services, and bookings.
7. **UX & UI:** Loading spinners, `react-hot-toast` notifications, empty states, responsive design, and clean Tailwind styling.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Demo Credentials

You can use the following seeded demo accounts to test different roles:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@quickserve.demo` | `Demo@1234` |
| **Provider 1** | `provider1@quickserve.demo` | `Demo@1234` |
| **Provider 2** | `provider2@quickserve.demo` | `Demo@1234` |
| **Customer 1** | `customer1@quickserve.demo` | `Demo@1234` |
| **Customer 2** | `customer2@quickserve.demo` | `Demo@1234` |

---

## Running Frontend & Backend Together

### 1. Start the Backend (`C:\Users\MOU\Quicktask`)
```bash
cd C:\Users\MOU\Quicktask
npm run dev
```

### 2. Start the Frontend (`C:\Users\MOU\Quickclient`)
```bash
cd C:\Users\MOU\Quickclient
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.
