# Sakhi Non-Veg Pickles - Full Stack E-commerce

Monorepo with:
- `frontend/` Next.js + React + Tailwind + Framer Motion + i18next
- `backend/` Node.js + Express + MongoDB + JWT + Nodemailer

## Features Implemented
- Animated Telugu landing screen (`???`) with auto-redirect to login.
- JWT auth (signup/login/me) with MongoDB user storage.
- Product grid and details pages from MongoDB API.
- Size-based dynamic pricing (`250g`, `500g`, `1kg`).
- Cart and wishlist with backend persistence.
- Fixed bottom nav for cart/wishlist.
- Floating WhatsApp chat button on all pages.
- Product-level WhatsApp order button with pre-filled message.
- Checkout with region-based delivery charges:
  - Andhra Pradesh: Rs.80
  - South India: Rs.120
  - Rest of India: Rs.180
- Order email sent to `sakhipickles.nonveg@gmail.com` via Nodemailer.
- Profile dropdown with Settings, Customer Support, Logout.
- Customer support page with phone/email/WhatsApp quick chat.
- Language switch (English/Telugu) via i18next.
- Seeded admin product data in MongoDB.

## Backend Setup
1. Go to `backend/`
2. Copy `.env.example` to `.env` and fill values.
3. Run:
   - `npm install`
   - `npm run dev`

Server starts at `http://localhost:5000`.

## Frontend Setup
1. Go to `frontend/`
2. Copy `.env.example` to `.env.local`
3. Run:
   - `npm install`
   - `npm run dev`

Frontend starts at `http://localhost:3000`.

## API Overview
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/user/collections`
- `POST /api/user/wishlist/toggle`
- `POST /api/user/cart/add`
- `PATCH /api/user/cart/update`
- `DELETE /api/user/cart/remove`
- `DELETE /api/user/cart/clear`
- `POST /api/orders/checkout`
- `GET /api/orders/my-orders`
- `GET /api/orders/admin/products`

## Deployment
- Frontend is Netlify-ready (`frontend/netlify.toml`).
- Backend is Render-ready (`render.yaml`).

## Notes
- Products are auto-seeded on first backend startup.
- For Gmail SMTP, use an app password for `EMAIL_PASS`.
