# 🚀 Deployment Guide - GerejaHub Phase 1

## ⚠️ Important: You Must Run the SQL Script!

The database schema and sample data are in `supabase/schema.sql` but **they won't appear until you run the script in Supabase**.

## Step-by-Step Deployment

### 1. Open Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Select your GerejaHub project

### 2. Run the SQL Script
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open `supabase/schema.sql` from your project
4. **Copy the ENTIRE file contents** (all 350+ lines)
5. Paste into the SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

### 3. Verify Tables Were Created
1. Click on **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - ✅ `event_rsvps`
   - ✅ `sermon_bookmarks`
   - ✅ `sermon_notes`
   - ✅ `ministry_members`

### 4. Verify Sample Data
Click on each table to see the data:

**sermons table** - Should have 8 rows:
- Grace for the Road Ahead
- A House of Prayer
- Faith That Serves
- Walking in the Spirit
- The Power of Forgiveness
- Building on the Rock
- Love in Action
- The Joy of Salvation

**ministries table** - Should have 8 rows:
- Kids Ministry (with description)
- Youth Ministry (with description)
- Worship Team (with description)
- Small Groups (with description)
- Outreach Ministry (with description)
- Prayer Ministry (with description)
- Hospitality Team (with description)
- Media Team (with description)

**events table** - Should have 3 rows:
- Sunday Worship
- Youth Night
- Prayer Gathering

### 5. Test the Application
```bash
npm run dev
```

Navigate to:
- **`/member/sermons`** - Should show 8 sermons
- **`/member/ministries`** - Should show 8 ministries
- **`/member/events`** - Should show 3 events

### 6. Edit Data in Admin Dashboard
1. Go to `/admin/login`
2. Sign in with your admin email
3. Navigate to:
   - **Sermons** - Edit sermon details, add media URLs
   - **Events** - Edit event details
   - **Ministries** - Edit ministry descriptions

## 🔧 Admin Dashboard Features

### Ministries Page (`/admin/ministries`)
You can edit:
- ✅ Name
- ✅ Description (full textarea)
- ✅ Sort order
- ✅ Published status
- ✅ Create new ministries
- ✅ Delete ministries

### Sermons Page (`/admin/sermons`)
You can edit:
- ✅ Title
- ✅ Speaker
- ✅ Date
- ✅ Summary
- ✅ Media URL
- ✅ Published status

### Events Page (`/admin/events`)
You can edit:
- ✅ Title
- ✅ Date
- ✅ Time label
- ✅ Location
- ✅ Description
- ✅ Published status

## 🐛 Troubleshooting

### "No ministries available yet"
**Problem**: The SQL script hasn't been run yet.  
**Solution**: Follow Step 2 above to run the SQL script.

### "Table already exists" error
**Problem**: You've run the script before.  
**Solution**: This is fine! The script uses `create table if not exists` and `on conflict do nothing`, so it won't duplicate data.

### Can't see new tables
**Problem**: SQL script had an error.  
**Solution**: 
1. Check the error message in SQL Editor
2. Make sure you copied the ENTIRE file
3. Try running it again

### Data not showing in member area
**Problem**: Data exists but pages show empty.  
**Solution**:
1. Check if `published` is set to `true` in the database
2. Refresh the page (Ctrl+R)
3. Check browser console for errors

## 📊 Database Structure

After running the script, you'll have:

**Existing Tables** (from Phase 2):
- `church_settings`
- `contact_messages`
- `events`
- `ministries`
- `sermons`
- `profiles`
- `prayer_requests`

**New Tables** (Phase 1):
- `event_rsvps` - Member RSVPs to events
- `sermon_bookmarks` - Bookmarked sermons
- `sermon_notes` - Personal sermon notes
- `ministry_members` - Ministry memberships

## ✅ Verification Checklist

- [ ] SQL script run successfully in Supabase
- [ ] 4 new tables created (event_rsvps, sermon_bookmarks, sermon_notes, ministry_members)
- [ ] 8 sermons with descriptions visible
- [ ] 8 ministries with descriptions visible
- [ ] 3 events visible
- [ ] Member pages load without errors
- [ ] Admin can edit all content
- [ ] RSVP buttons work on events
- [ ] Bookmark buttons work on sermons
- [ ] Join buttons work on ministries

## 🎯 Next Steps After Deployment

1. **Customize Content**:
   - Update sermon titles and speakers
   - Add real media URLs for sermons
   - Customize ministry descriptions
   - Add more events

2. **Test Member Features**:
   - Create a test member account
   - RSVP to events
   - Bookmark sermons
   - Join ministries

3. **Invite Members**:
   - Share member login link: `/member/login`
   - Encourage members to explore features
   - Collect feedback

## 📞 Need Help?

If you're still seeing "No ministries available yet" after running the SQL script:
1. Check Supabase Table Editor - do you see 8 ministries?
2. Check if `published` column is `true`
3. Try refreshing your browser
4. Check browser console for errors (F12)

---

**Remember**: The SQL script must be run in Supabase SQL Editor for the data to appear!