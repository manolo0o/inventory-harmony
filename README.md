# 📦 InvenTrack — Inventory Management System

A production-ready, full-stack Inventory Management CMS built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### 🔐 Authentication
- Email/password sign-up and sign-in via **Supabase Auth**
- Protected routes — unauthenticated users are redirected to `/login`
- Session persistence with automatic token refresh

### 📊 Dashboard
- **KPI Cards** — Total Products, Total Stock, Total Value, Low Stock alerts
- **Stock Value by Category** — Bar chart showing inventory value across all categories
- **Stock Status Distribution** — Pie chart with percentage labels (In Stock / Low Stock / Out of Stock)
- Real-time data powered by Supabase Realtime subscriptions

### 📦 Inventory Management
- Full **CRUD operations** on inventory items (Create, Read, Update, Delete)
- Sortable, searchable data table with category filtering
- **Add/Edit Product** modal with form validation (Product Name, SKU, Category, Price, Quantity)
- **Delete confirmation** dialog to prevent accidental removal
- KPI summary cards at the top of the inventory view

### ⚙️ Settings
- **Email Low-Stock Alerts** — Toggle automatic email notifications when product stock drops below a configurable threshold
- Admin email address configuration
- Customizable alert threshold
- Powered by **Resend** email API via a Supabase Edge Function

### 🔔 Low-Stock Email Alerts (Supabase Edge Function)
- Edge Function `notify-low-stock` triggers on inventory updates
- Sends styled HTML email alerts via the **Resend API**
- Reads per-user settings from the `app_settings` table
- Automatically skips if alerts are disabled or stock is above threshold

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18, TypeScript, Vite          |
| Styling      | Tailwind CSS, shadcn/ui             |
| Charts       | Recharts                            |
| State        | TanStack React Query                |
| Routing      | React Router v6                     |
| Backend/DB   | Supabase (PostgreSQL + Auth + Edge Functions) |
| Email Alerts | Resend API                          |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppSidebar.tsx           # Navigation sidebar
│   ├── TopBar.tsx               # Top header bar with "Add Product" button
│   ├── DashboardKPICards.tsx     # KPI summary cards
│   ├── DashboardInventoryTable.tsx # Inventory data table
│   ├── InventoryCharts.tsx      # Dashboard charts (Bar + Pie)
│   ├── ProductFormModal.tsx     # Add/Edit product modal form
│   ├── DeleteConfirmDialog.tsx  # Delete confirmation dialog
│   ├── ProtectedRoute.tsx       # Auth route guard
│   ├── NavLink.tsx              # Navigation link component
│   └── ui/                     # shadcn/ui primitives
├── contexts/
│   └── AuthContext.tsx          # Supabase auth context provider
├── hooks/
│   ├── useInventory.ts          # Inventory CRUD + realtime hook
│   └── useAppSettings.ts       # Settings CRUD hook
├── integrations/supabase/
│   ├── client.ts               # Supabase client initialization
│   └── types.ts                # Auto-generated database types
├── pages/
│   ├── Login.tsx               # Auth page (sign in / sign up)
│   ├── Dashboard.tsx           # Dashboard with charts
│   ├── Inventory.tsx           # Inventory management page
│   ├── Settings.tsx            # Notification settings page
│   └── NotFound.tsx            # 404 page
└── App.tsx                     # Root component with routing

supabase/
├── functions/
│   └── notify-low-stock/
│       └── index.ts            # Edge Function for email alerts
└── config.toml                 # Supabase project configuration
```

---

## 🗄️ Database Schema

### `inventory` table

| Column        | Type      | Description              |
|---------------|-----------|--------------------------|
| `id`          | UUID (PK) | Auto-generated           |
| `user_id`     | UUID (FK) | References `auth.users`  |
| `product_name`| TEXT      | Product display name     |
| `sku`         | TEXT      | Stock keeping unit code  |
| `category`    | TEXT      | Product category         |
| `unit_price`  | NUMERIC   | Price per unit           |
| `quantity`    | INTEGER   | Current stock count      |
| `image_url`   | TEXT      | Optional product image   |
| `created_at`  | TIMESTAMP | Row creation timestamp   |
| `updated_at`  | TIMESTAMP | Last update timestamp    |

### `app_settings` table

| Column            | Type      | Description                     |
|-------------------|-----------|---------------------------------|
| `id`              | UUID (PK) | Auto-generated                  |
| `user_id`         | UUID (FK) | References `auth.users`         |
| `admin_phone`     | TEXT      | Admin email for alerts          |
| `alert_threshold` | INTEGER   | Low stock threshold (default 5) |
| `alerts_enabled`  | BOOLEAN   | Enable/disable email alerts     |
| `created_at`      | TIMESTAMP | Row creation timestamp          |
| `updated_at`      | TIMESTAMP | Last update timestamp           |

> **RLS** is enabled on both tables — users can only access their own data.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [Bun](https://bun.sh/) (recommended) or npm
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd inventracker
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 4. Set up the database

Run the SQL migrations in your Supabase dashboard or via the CLI. The migrations are located in `supabase/migrations/` and will create the `inventory` and `app_settings` tables with proper RLS policies.

### 5. Deploy the Edge Function

```bash
supabase functions deploy notify-low-stock
```

Set the required secret in Supabase Dashboard → Settings → Edge Functions:

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key
```

### 6. Start the dev server

```bash
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📧 Email Alerts Setup

1. Create a free account at [resend.com](https://resend.com)
2. Generate an API key from the Resend dashboard
3. Add the `RESEND_API_KEY` secret to your Supabase Edge Functions
4. In the app, go to **Settings → Notifications**
5. Enable email alerts, enter the admin email, and set the stock threshold
6. When any product quantity drops at or below the threshold, an alert email is sent automatically

---

## 🧪 Testing

```bash
bun run test
# or
npm run test
```

E2E tests are configured with **Playwright**:

```bash
npx playwright test
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
