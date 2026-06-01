# Phase 2 Deployment Guide

## 📋 Overview

Phase 2 adds advanced member engagement features:
- **Notifications Center** - Keep members informed
- **Small Groups** - Build community
- **Enhanced Dashboard** - Personalized experience
- **Sermon Notes** - Deeper engagement with sermons
- **Event Check-in** - Attendance tracking
- **Ministry Announcements** - Better communication

---

## 🗄️ Step 1: Run Database Migration

### Required: Run Phase 2 Schema

**In Supabase SQL Editor, run:**
```bash
supabase/phase2_schema.sql
```

This creates:
- `notifications` table
- `small_groups` table
- `small_group_members` table
- `event_attendance` table
- `ministry_announcements` table
- RLS policies for all tables
- Helper functions for notifications
- Sample data for small groups

### Verify Tables Created

Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'notifications',
  'small_groups',
  'small_group_members',
  'event_attendance',
  'ministry_announcements'
);
```

You should see all 5 tables listed.

---

## 🔧 Step 2: Fix Existing Issues (If Not Done)

### A. Fix Ministry RLS Policy

If you haven't run this yet:
```bash
supabase/fix_ministry_members_rls.sql
```

### B. Add Ministry Schedule Fields

If you haven't run this yet:
```bash
supabase/add_ministry_schedule.sql
```

---

## 📦 Step 3: Install Dependencies (If Needed)

No new dependencies required for Phase 2! Everything uses existing Next.js and Supabase packages.

---

## 🚀 Step 4: Features Included

### 1. Enhanced Dashboard ✅
**Location:** `app/member/page.tsx`

**Features:**
- Upcoming events you're attending
- Your ministries at a glance
- Recent prayer requests
- Latest sermon
- Quick action buttons
- Notifications badge

### 2. Notifications Center ✅
**Location:** `app/member/notifications/page.tsx`

**Features:**
- View all notifications
- Mark as read/unread
- Filter by type (event, prayer, ministry, sermon)
- Delete notifications
- Real-time updates

### 3. Small Groups ✅
**Location:** `app/member/groups/page.tsx`

**Features:**
- Browse all small groups
- See group details (leader, schedule, location)
- Join/leave groups
- View member count
- See if group is full

### 4. Sermon Notes ✅
**Location:** `app/member/sermons/[id]/notes/page.tsx`

**Features:**
- Take notes while watching sermons
- Rich text editor
- Auto-save
- View/edit past notes
- Export notes

### 5. Event Check-in ✅
**Admin Feature:** `app/admin/events/[id]/checkin/page.tsx`

**Features:**
- QR code for quick check-in
- Manual check-in by admin
- View attendance list
- Export attendance report

### 6. Ministry Announcements ✅
**Location:** `app/member/ministries/[id]/page.tsx`

**Features:**
- Leaders can post announcements
- Members receive notifications
- View announcement history
- Reply to announcements (future)

---

## 📊 Step 5: Test Each Feature

### Test Notifications
1. Go to `/member/notifications`
2. Should see sample notifications (if any)
3. Click "Mark as read" - should update
4. Filter by type - should work

### Test Small Groups
1. Go to `/member/groups`
2. Should see 6 sample groups
3. Click "Join" on a group
4. Navigate away and back - should show "Leave"
5. Check member count increases

### Test Enhanced Dashboard
1. Go to `/member`
2. Should see personalized widgets
3. Upcoming events section
4. Your ministries section
5. Quick actions work

### Test Sermon Notes
1. Go to `/member/sermons`
2. Click on a sermon
3. Click "Take Notes"
4. Write some notes
5. Save and verify they persist

### Test Event Check-in (Admin)
1. Login as admin
2. Go to `/admin/events`
3. Click on an event
4. Click "Check-in"
5. Scan QR or manual check-in

### Test Ministry Announcements
1. Join a ministry as member
2. Admin/Leader posts announcement
3. Member receives notification
4. View announcement in ministry page

---

## 🎨 Step 6: UI Components Created

All components follow the existing design system:

### New Components
- `app/member/notifications/notification-item.tsx`
- `app/member/notifications/notification-filter.tsx`
- `app/member/groups/group-card.tsx`
- `app/member/groups/actions.ts`
- `app/member/sermons/[id]/notes/note-editor.tsx`
- `app/member/sermons/[id]/notes/actions.ts`
- `app/admin/events/[id]/checkin/qr-code.tsx`
- `app/admin/events/[id]/checkin/checkin-list.tsx`

### Updated Components
- `app/member/page.tsx` - Enhanced dashboard
- `app/member/member-shell.tsx` - Added notifications badge
- `app/member/ministries/[id]/page.tsx` - Added announcements

---

## 🔐 Security Checklist

- ✅ RLS policies on all new tables
- ✅ User authentication required
- ✅ Leaders can only manage their groups/ministries
- ✅ Admins have full access
- ✅ Users can only see their own notifications
- ✅ Input validation on all forms

---

## 📈 Performance Considerations

### Indexes Created
- `notifications_user_id_idx` - Fast user notification lookup
- `notifications_read_idx` - Filter read/unread
- `notifications_created_at_idx` - Sort by date
- `small_group_members_group_id_idx` - Fast group member lookup
- `small_group_members_user_id_idx` - Fast user groups lookup
- `event_attendance_event_id_idx` - Fast event attendance lookup
- `ministry_announcements_ministry_id_idx` - Fast ministry announcements

### Optimization Tips
1. Use pagination for notifications (limit 20 per page)
2. Cache small groups list (revalidate every 5 minutes)
3. Lazy load sermon notes (only when viewing sermon)
4. Use React.memo for notification items

---

## 🐛 Troubleshooting

### "Table does not exist"
- Run `supabase/phase2_schema.sql` in Supabase SQL Editor
- Verify tables created with the query in Step 1

### "Permission denied"
- Check RLS policies are created
- Verify user is authenticated
- Check user role (member/admin)

### "Notifications not showing"
- Check `notifications` table has data
- Verify user_id matches authenticated user
- Check RLS policy allows reading

### "Can't join small group"
- Check group is published and open
- Verify max_members not reached
- Check RLS policy allows insert

### TypeScript errors
- Run `npm install` to ensure types are updated
- Restart TypeScript server in VS Code
- Check `lib/supabase/types.ts` includes Phase 2 tables

---

## 📝 Next Steps After Deployment

### Immediate
1. Test all features thoroughly
2. Create test users and data
3. Verify notifications work
4. Check mobile responsiveness

### Short-term
5. Add email notifications (using Supabase Edge Functions)
6. Add push notifications (PWA)
7. Create admin dashboard for analytics
8. Add more notification types

### Long-term
9. Implement Phase 3 features
10. Add mobile app (React Native)
11. Advanced analytics and reporting
12. Integration with church management software

---

## 🎯 Success Metrics

After deployment, track:
- [ ] Notification open rate
- [ ] Small group join rate
- [ ] Sermon notes usage
- [ ] Event check-in rate
- [ ] Ministry announcement engagement
- [ ] Dashboard daily active users

---

## 💡 Tips

1. **Start with notifications** - Most impactful feature
2. **Promote small groups** - Announce in church
3. **Train leaders** - Show them how to post announcements
4. **Use QR codes** - Print for event check-ins
5. **Monitor engagement** - Adjust features based on usage

---

**Estimated Deployment Time:** 30-45 minutes  
**Estimated Testing Time:** 1-2 hours  
**Total Time:** 2-3 hours

---

**Questions?** Check the code comments or create an issue in the repository.

**Last Updated:** June 1, 2026  
**Version:** 2.0.0  
**Status:** Ready for deployment