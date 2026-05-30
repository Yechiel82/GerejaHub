# GerejaHub

GerejaHub is an open-source church website and PWA starter built with Next.js.

Phase 1 focuses on the public church website experience: visitor information, sermons, events, ministries, giving placement, contact, and basic PWA support.

## Features

- Public landing page for a church community
- Visitor section with service time, location, and contact details
- Sermon preview section
- Events section
- Ministries section
- Giving call-to-action placement
- Contact form layout
- Supabase-backed public content
- Admin login and protected dashboard
- Admin forms for settings, sermons, events, and ministries
- Member area with profiles and prayer requests
- Web app manifest
- Basic service worker for installable PWA behavior
- Video-ready landing page hero with poster fallback
- Responsive design for mobile and desktop

## Tech Stack

- Next.js
- React
- TypeScript
- CSS
- Node.js

## Getting Started

Use Node.js 20.19+, 22.13+, or 24+.

Create a Supabase project, copy `.env.example` to `.env`, and fill in your project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=admin@example.com
```

Run `supabase/schema.sql` in the Supabase SQL editor to create the Phase 2 tables, policies, and starter content.

Create an admin user in Supabase Auth, set `ADMIN_EMAILS` to a comma-separated list of allowed admin email addresses, then sign in at `/admin/login`.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
  admin/
  actions/
  globals.css
  layout.tsx
  page.tsx
  pwa-register.tsx
lib/
  data/
  supabase/
supabase/
  schema.sql
public/
  icon.svg
  manifest.webmanifest
  sw.js
```

## Hero Video

The landing page looks for these local files:

- `public/media/hero.webm`
- `public/media/hero.mp4`

For a harvest video, export a short silent loop instead of using the full video. A good target is 6-8 seconds, 1280px wide, muted, and a few megabytes per format. Keep raw source videos out of git.

Example commands with ffmpeg:

```bash
ffmpeg -ss 00:00:02 -t 8 -i original.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 34 public/media/hero.webm
ffmpeg -ss 00:00:02 -t 8 -i original.mp4 -an -vf "scale=1280:-2,fps=24" -c:v libx264 -profile:v high -pix_fmt yuv420p -movflags +faststart -crf 28 public/media/hero.mp4
```

## Member Area

Phase 3 adds member accounts and prayer requests.

Run the updated `supabase/schema.sql` in Supabase SQL Editor after pulling Phase 3. This adds:

- `profiles` with `admin`, `leader`, and `member` roles
- `prayer_requests` for member-submitted prayer needs
- RLS policies for member-owned requests and admin management

Admins are bootstrapped from `ADMIN_EMAILS`. When one of those emails signs in, the server creates or updates that profile with the `admin` role. Everyone else starts as `member`.

Member routes:

- `/member/login`
- `/member`
- `/member/prayer`
- `/member/profile`

## Google Login

GerejaHub supports Google login through Supabase Auth.

In Supabase, go to Authentication > Providers > Google and enable Sign in with Google. Add the Google OAuth Client ID and Client Secret from Google Cloud Console.

Register the Supabase callback URL in Google Cloud as an authorized redirect URI:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

For local development, add this URL in Supabase Authentication > URL Configuration:

```text
http://localhost:3000/auth/callback
```

The app redirects Google sign-ins back to `/admin` after Supabase finishes the OAuth callback. Google users still need to match `ADMIN_EMAILS` to access protected admin pages.

## PWA Notes

The service worker is registered only in production. To test PWA behavior locally, build and start the production server:

```bash
npm run build
npm run start
```

## Roadmap

- Phase 1: Public website and basic PWA setup
- Phase 2: Supabase auth, database-backed content, and admin dashboard
- Phase 3: Member login, profile roles, prayer requests, notifications, and community features

## License

This project is intended to be open source. Add your preferred license before publishing.
