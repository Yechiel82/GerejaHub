# Phase 1 Member Area Implementation

## 🎯 Overview

Phase 1 adds essential member features that align with the public website content:
- **Events with RSVP** - Members can see all events and RSVP
- **Sermons Library** - Full access to sermons with bookmarks and notes
- **Ministry Involvement** - Browse and join ministries

## ✅ What's Been Implemented

### 1. Database Schema Updates
**File**: `supabase/schema.sql`

New tables added:
- `event_rsvps` - Track member RSVPs to events
- `sermon_bookmarks` - Save favorite sermons
- `sermon_notes` - Personal sermon notes
- `ministry_members` - Ministry membership tracking

All tables include:
- Row Level Security (RLS) policies
- Proper indexes for performance
- Triggers for `updated_at` timestamps
- Unique constraints to prevent duplicates

### 2. TypeScript Types
**File**: `lib/supabase/types.ts`

Added types for:
- `EventRsvp`
- `SermonBookmark`
- `SermonNote`
- `MinistryMember`

### 3. Events Page with RSVP
**Files Created**:
- `app/member/events/page.tsx` - Events listing page
- `app/member/events/rsvp-button.tsx` - Interactive RSVP component
- `app/member/events/actions.ts` - Server actions for RSVP

**Features**:
- View all published events
- RSVP with three options: Going, Maybe, Can't Go
- Real-time status updates
- Loading states during submission
- Success/error feedback
- Accessible with ARIA labels

### 4. Navigation Updates
**File**: `app/member/member-shell.tsx`

Added navigation links for:
- Events
- Sermons
- Ministries

### 5. Styling
**File**: `app/globals.css`

Added CSS for:
- Event cards with RSVP buttons
- Sermon cards with action buttons
- Ministry cards
- Button groups and states
- Success/error messages
- Responsive layouts

## 📋 Still To Implement

### Sermons Library Page
**File to create**: `app/member/sermons/page.tsx`

Features needed:
- List all sermons (not just 3)
- Search and filter functionality
- Bookmark button for each sermon
- Notes section for each sermon
- Media player integration
- Download links

### Ministries Page
**File to create**: `app/member/ministries/page.tsx`

Features needed:
- List all ministries with descriptions
- Join/Leave buttons
- Show member count
- Display joined ministries
- Ministry leader information
- Meeting schedules

### Enhanced Dashboard
**File to update**: `app/member/page.tsx`

Add widgets for:
- Upcoming events you're attending
- Your ministries
- Recent sermons
- Quick actions

## 🚀 How to Deploy

### 1. Run Database Migration

In Supabase SQL Editor, run the updated `supabase/schema.sql`:

```sql
-- The schema file includes all Phase 1 tables
-- Run the entire file or just the Phase 1 section
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Test Locally

```bash
npm run dev
```

Navigate to:
- `/member/login` - Sign in as a member
- `/member/events` - Test RSVP functionality

### 4. Verify Database

Check that tables were created:
- `event_rsvps`
- `sermon_bookmarks`
- `sermon_notes`
- `ministry_members`

### 5. Test RSVP Flow

1. Sign in as a member
2. Go to Events page
3. Click "Going" on an event
4. Verify RSVP is saved in database
5. Refresh page - status should persist

## 🔧 Configuration

No additional environment variables needed for Phase 1.

## 📊 Database Queries

### Get Events with User RSVP
```typescript
const { data } = await supabase
  .from('events')
  .select(`
    *,
    event_rsvps!left(status)
  `)
  .eq('published', true)
```

### Upsert RSVP
```typescript
await supabase
  .from('event_rsvps')
  .upsert({
    event_id: eventId,
    user_id: userId,
    status: 'going'
  }, {
    onConflict: 'event_id,user_id'
  })
```

## 🎨 UI Components

### RSVP Button States
- **Default**: Gray outline buttons
- **Selected**: Green (Going), Yellow (Maybe), Red (Can't Go)
- **Loading**: Shows spinner
- **Disabled**: Reduced opacity

### Event Card Layout
```
┌─────────────────────────────────┐
│ Event Title                     │
│ Time Label                      │
│ Location                        │
│ Description (if available)      │
│ Date Badge                      │
│                                 │
│ [Going] [Maybe] [Can't Go]     │
└─────────────────────────────────┘
```

## 🔐 Security

All Phase 1 features use RLS policies:
- Users can only manage their own RSVPs
- Users can only see their own bookmarks/notes
- Admins can view all data
- Ministry leaders can see their ministry members

## 📱 Mobile Responsive

All new pages are mobile-friendly:
- Stacked layouts on small screens
- Touch-friendly button sizes
- Readable text sizes
- Proper spacing

## ⚡ Performance

Optimizations included:
- Database indexes on foreign keys
- Efficient queries with joins
- Revalidation after mutations
- Loading states prevent double-submissions

## 🧪 Testing

To test Phase 1 features:

1. **Events RSVP**:
   - Create test events in admin
   - Sign in as member
   - RSVP to events
   - Change RSVP status
   - Verify in database

2. **Navigation**:
   - Check all nav links work
   - Verify active states
   - Test on mobile

3. **Error Handling**:
   - Try RSVP without auth (should fail gracefully)
   - Test with invalid event IDs
   - Check error messages display

## 📝 Next Steps

After Phase 1 is complete and tested:

1. **Implement Sermons Library**
   - Create sermons page
   - Add bookmark functionality
   - Add notes feature
   - Implement search/filter

2. **Implement Ministries Page**
   - Create ministries page
   - Add join/leave functionality
   - Show member lists
   - Display schedules

3. **Enhance Dashboard**
   - Add personalized widgets
   - Show upcoming events
   - Display joined ministries
   - Quick action buttons

4. **Phase 2 Features**
   - Notifications system
   - Small groups
   - Enhanced profiles

## 🐛 Known Issues

None currently. Report issues as they're discovered.

## 💡 Tips

- Always test RSVP changes in database
- Check RLS policies if queries fail
- Use browser DevTools to debug
- Check Supabase logs for errors

## 📚 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useTransition](https://react.dev/reference/react/useTransition)

---

**Status**: Events with RSVP ✅ | Sermons Library ⏳ | Ministries ⏳ | Dashboard ⏳