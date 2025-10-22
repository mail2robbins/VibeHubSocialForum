# Quick Start Guide

## 🚀 Setting Up Your New Supabase Project

### 1️⃣ Create Supabase Project
1. Go to https://app.supabase.com
2. Create new project
3. Copy **Project URL** and **anon key** to `.env` file

### 2️⃣ Run Database Schema
1. Open Supabase SQL Editor
2. Copy all content from `supabase-schema.sql`
3. Paste and run it

### 3️⃣ Create Storage Bucket
1. Go to Storage in Supabase
2. Create bucket named: `post-images`
3. Make it **public** ✅

### 4️⃣ Enable GitHub OAuth
1. Go to Authentication > Providers > GitHub
2. Create GitHub OAuth App at https://github.com/settings/developers
3. Copy Client ID and Secret to Supabase
4. Add callback URL from Supabase to GitHub app

### 5️⃣ Configure URLs
1. Go to Authentication > URL Configuration
2. Add: `http://localhost:5173` and `http://localhost:5173/**`

### 6️⃣ Verify Setup
```bash
npm run verify-setup
```

### 7️⃣ Start Development
```bash
npm run dev
```

## 📋 Checklist

- [ ] Supabase project created
- [ ] `.env` file updated with new credentials
- [ ] Database schema executed
- [ ] `post-images` bucket created (public)
- [ ] GitHub OAuth enabled
- [ ] Site URLs configured
- [ ] Verification script passed
- [ ] App running and GitHub login works

## 🔧 Your .env File Should Look Like:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for detailed step-by-step instructions.

## ❓ Having Issues?

1. Check the browser console for errors
2. Verify all steps in the checklist
3. Review `SUPABASE_SETUP.md` troubleshooting section
4. Make sure to restart dev server after changing `.env`
