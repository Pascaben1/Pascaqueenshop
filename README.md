# Pascaqueen Herbal — Formula Foods

An e-commerce storefront for Pascaqueen's herbal products, built with React + Vite,
Supabase (database, auth, storage, realtime), and deployed on Vercel.

## Features

- Public storefront with product catalog, search, and a cart
- Customer accounts: sign up / sign in with **email + password** (no Google or
  other third-party sign-in) via the account icon in the header
- Checkout hands off to WhatsApp (+234 814 673 0044) with the order pre-filled,
  and the order is logged to Supabase (tagged to the signed-in customer, if any)
- Admin dashboard restricted to **samuelivere92@gmail.com** only, with:
  - Real-time analytics (page views, orders, revenue, product count, recent orders)
  - Product management: add/edit/delete products, upload photos, set prices
- Footer credit: "A product of HSPR TECHNOLOGIES"

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `products`, `orders`, and `page_views` tables, row-level
   security policies, realtime replication, and the `product-images` storage
   bucket.
3. Go to **Authentication → Users → Add user** and create the admin account:
   - Email: `samuelivere92@gmail.com`
   - Password: choose a strong password
   - This is the only account that can access `/admin`. Regular customers can
     sign themselves up from the storefront (account icon → Sign Up) —
     no manual setup needed for them.
4. Copy your **Project URL** and **anon public key** from
   **Project Settings → API**.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Run locally

```
npm install
npm run dev
```

## 4. Deploy to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import it in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Add the same environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
5. Deploy. `vercel.json` is already set up to route all paths to `index.html`
   for client-side routing.

## Admin dashboard

Visit `/admin` on the deployed site (or `http://localhost:5173/admin` locally)
and sign in with the admin email/password created in step 1. Any other
account will see an "Access Restricted" screen — only
`samuelivere92@gmail.com` can manage products or view analytics.
