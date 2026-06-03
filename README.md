# 🏛️ GerejaHub

**A modern, open-source church management system built with Next.js 15, Supabase, and TypeScript.**

GerejaHub helps churches build stronger communities through digital engagement. Manage sermons, events, ministries, prayer requests, and member interactions—all in one beautiful, mobile-friendly platform.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

### 🌐 **Public Website**
- **Hero Section** - Customizable welcome message with video background
- **Sermons** - Browse and listen to past sermons
- **Events** - View upcoming church events and activities
- **Ministries** - Explore different ministry opportunities
- **Contact Form** - Rate-limited, validated contact submissions

### 👥 **Member Area** (Google OAuth)
- **Dashboard** - Personalized member homepage
- **Prayer Wall** - Share and pray for community requests
  - "I've Prayed" button with counter
  - Private or church-wide visibility
  - 15-minute edit window
  - Soft delete functionality
- **Sermon Notes** - Take and save personal sermon notes
- **Event RSVPs** - RSVP to church events
- **Ministry Membership** - Join and manage ministry involvement
- **Small Groups** - Find and join small groups
- **Notifications** - Stay updated with church activities
- **Profile Management** - Update personal information

### 🔐 **Admin Panel** (Google OAuth)
- **Content Management** - Manage sermons, events, ministries
- **Prayer Moderation** - View all prayers, hide inappropriate content
- **Member Management** - View and manage member profiles
- **Settings** - Customize church information
- **Analytics** - View engagement statistics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([free tier available](https://supabase.com))
- Google OAuth credentials

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gerejahub.git
cd gerejahub
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the entire contents of `supabase/COMPLETE_SETUP.sql`
4. Paste and execute in the SQL Editor
5. Wait for completion (creates all tables, policies, and sample data)

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret

### 4. Configure Supabase Authentication

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste your Google Client ID and Client Secret
4. Save changes

### 5. Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration (comma-separated emails)
ADMIN_EMAILS=admin@example.com,pastor@example.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find Supabase keys:**
- Go to **Project Settings** → **API**
- Copy `URL`, `anon/public key`, and `service_role key`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your Admin Account

1. Click **Member Login** or **Admin Login**
2. Sign in with Google using an email listed in `ADMIN_EMAILS`
3. Your account will automatically have admin privileges

---

## 📁 Project Structure

```
gerejahub/
├── app/                      # Next.js 15 App Router
│   ├── (public)/            # Public pages
│   │   ├── page.tsx         # Landing page
│   │   ├── sermons/         # Sermons listing
│   │   ├── events/          # Events listing
│   │   └── ministries/      # Ministries listing
│   ├── member/              # Member area (protected)
│   │   ├── page.tsx         # Member dashboard
│   │   ├── prayer/          # Prayer requests
│   │   ├── sermons/         # Sermon notes
│   │   ├── events/          # Event RSVPs
│   │   ├── ministries/      # Ministry membership
│   │   ├── groups/          # Small groups
│   │   └── notifications/   # Notifications
│   ├── admin/               # Admin panel (protected)
│   │   ├── page.tsx         # Admin dashboard
│   │   ├── prayer/          # Prayer moderation
│   │   ├── sermons/         # Sermon management
│   │   ├── events/          # Event management
│   │   ├── ministries/      # Ministry management
│   │   └── settings/        # Church settings
│   ├── auth/                # Authentication
│   │   └── callback/        # OAuth callback
│   ├── actions/             # Server actions
│   └── components/          # Shared components
├── lib/                     # Utilities and helpers
│   ├── supabase/           # Supabase clients
│   ├── utils/              # Utility functions
│   └── data/               # Data helpers
├── supabase/               # Database migrations
│   └── COMPLETE_SETUP.sql  # Complete database setup
└── public/                 # Static assets
```

---

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles with roles (admin/leader/member)
- **prayer_requests** - Prayer requests with soft delete and hide features
- **prayer_interactions** - Tracks who prayed for what
- **sermons** - Sermon records with media URLs
- **events** - Church events and activities
- **ministries** - Ministry information
- **church_settings** - Customizable church information

### Member Features
- **event_rsvps** - Event attendance tracking
- **sermon_notes** - Personal sermon notes
- **sermon_bookmarks** - Bookmarked sermons
- **ministry_members** - Ministry membership
- **small_groups** - Small group information
- **small_group_members** - Small group membership
- **notifications** - User notifications

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** (admin/leader/member)
- **Soft delete** for prayer requests
- **Hide feature** for content moderation

---

## 🔒 Security Features

✅ **Authentication**
- Google OAuth only (no password management)
- Secure session handling with Supabase Auth
- Role-based access control

✅ **Input Validation**
- Server-side validation for all forms
- Input sanitization (removes HTML tags)
- Length constraints on all text fields

✅ **Rate Limiting**
- 5 requests per minute per IP on contact form
- In-memory rate limiting (production-ready)
- Automatic cleanup of expired entries

✅ **Database Security**
- Row Level Security (RLS) on all tables
- Service role key only used in admin operations
- Prepared statements prevent SQL injection

✅ **Environment Variables**
- No sensitive data in `.env.example`
- All secrets in `.env.local` (gitignored)
- Clear documentation for required variables

---

## 🎨 Customization

### Church Information
1. Log in as admin
2. Go to **Admin** → **Settings**
3. Update church name, address, service times, etc.

### Branding
- Replace `/public/media/logo.png` with your church logo
- Update colors in `app/globals.css`
- Modify hero video in `/public/media/`

### Content
- Add sermons, events, and ministries through admin panel
- Sample data is included for demonstration

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important:** Update Google OAuth redirect URIs with your production URL.

### Other Platforms

GerejaHub works on any platform that supports Next.js 15:
- Netlify
- Railway
- Render
- Self-hosted with Docker

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Phase 1 Implementation](PHASE1_IMPLEMENTATION.md) - Member area features
- [Phase 2 Deployment](PHASE2_DEPLOYMENT.md) - Advanced features
- [Member Area Features](MEMBER_AREA_FEATURES.md) - Feature documentation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- TypeScript for type safety
- Server Components by default
- Client Components only when needed
- Descriptive variable names
- Comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js 15](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- Authentication via [Google OAuth](https://developers.google.com/identity)
- Styled with modern CSS
- Icons from Unicode emoji

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gerejahub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gerejahub/discussions)
- **Email**: support@gerejahub.org

---

## 🗺️ Roadmap

### Current Features ✅
- [x] Public website with sermons, events, ministries
- [x] Member area with Google OAuth
- [x] Prayer wall with "I've Prayed" feature
- [x] Sermon notes
- [x] Event RSVPs
- [x] Ministry membership
- [x] Admin panel with content management
- [x] Prayer moderation (hide/soft delete)
- [x] Notifications system
- [x] Small groups

### Planned Features 🚀
- [ ] Mobile app (React Native)
- [ ] Online giving integration
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Attendance tracking
- [ ] Volunteer scheduling
- [ ] Resource library
- [ ] Live streaming integration
- [ ] Multi-language support
- [ ] Church directory

---

## 📊 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + Google OAuth
- **Styling**: Modern CSS with CSS Variables
- **Deployment**: Vercel (recommended)
- **Testing**: Jest + React Testing Library

---

## 🌟 Star History

If you find GerejaHub useful, please consider giving it a star on GitHub! ⭐

---

**Made with ❤️ for churches worldwide**

*GerejaHub - Building stronger communities through digital engagement*
