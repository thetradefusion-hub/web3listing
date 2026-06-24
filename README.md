# TokenWeb3Listing.com

B2B Partner & Reseller Portal for Web3 listing, marketing, and growth services.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Supabase** (PostgreSQL, Auth, Storage, RLS)
- **Tailwind CSS** + **shadcn/ui**
- **Resend** (email notifications)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase and Resend credentials:

```bash
cp .env.example .env.local
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Run the seed data: `supabase/seed.sql`
4. Create storage buckets: `kyc-documents`, `project-assets`, `deliverables`, `payment-proofs`, `withdrawal-proofs`
5. Create your first admin user via Supabase Auth, then update their role:

```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'your@email.com';
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Roles

| Role | Access |
|------|--------|
| Super Admin | Full system access |
| Operations Manager | Orders, delivery, quotations |
| Partner / Reseller | KYC, projects, orders, wallet |
| Service Team | Assigned orders, deliverables |

## Core Flow

1. Admin creates partner account → credentials emailed
2. Partner completes KYC → admin approves
3. Partner creates project → selects service → order placed
4. Admin generates quote (if needed) → partner pays → admin verifies
5. Order progresses → deliverables uploaded → commission credited
6. Partner requests withdrawal → admin processes manually

## Project Structure

```
src/
├── app/
│   ├── (public)/     # Marketing website
│   ├── partner/        # Partner portal
│   ├── admin/        # Admin panel
│   └── login/        # Authentication
├── components/
├── lib/
│   ├── actions/      # Server actions
│   ├── supabase/     # Supabase clients
│   └── validations/  # Zod schemas
└── types/
supabase/
├── migrations/       # Database schema
└── seed.sql          # Initial data
```

## Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Database**: Supabase Cloud
- Set all environment variables in Vercel dashboard
