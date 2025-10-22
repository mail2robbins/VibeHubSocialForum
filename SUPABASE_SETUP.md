# Supabase Setup Guide for VibeHub Social Forum

This guide will help you set up a new Supabase project for your VibeHub Social Forum application.

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Your `.env` file with the new Supabase credentials

## Step-by-Step Setup

### 1. Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: VibeHub Social Forum (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
3. Update your `.env` file:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 3. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success. No rows returned" message

This will create:
- ✅ All required tables (communities, posts, votes, comments)
- ✅ Indexes for better performance
- ✅ RPC function for posts with counts
- ✅ Row Level Security (RLS) policies

### 4. Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Enter bucket details:
   - **Name**: `post-images`
   - **Public bucket**: ✅ Check this box (important!)
4. Click **"Create bucket"**

#### Configure Bucket Policies

1. Click on the `post-images` bucket
2. Go to **Policies** tab
3. Click **"New policy"**
4. Select **"For full customization"**
5. Add the following policies:

**Policy 1: Allow public read access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'post-images' );
```

**Policy 2: Allow authenticated users to upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'post-images' );
```

**Policy 3: Allow users to update their uploads**
```sql
CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'post-images' );
```

**Policy 4: Allow users to delete their uploads**
```sql
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'post-images' );
```

### 5. Enable GitHub Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** in the list
3. Click to expand it
4. Toggle **"Enable Sign in with GitHub"** to ON

#### Get GitHub OAuth Credentials

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: VibeHub Social Forum
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: Copy this from Supabase (shown in the GitHub provider settings)
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it
7. Go back to Supabase and paste:
   - **Client ID** in the GitHub Client ID field
   - **Client Secret** in the GitHub Client Secret field
8. Click **"Save"**

### 6. Configure Site URL

1. In your Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add:
     - `http://localhost:5173`
     - `http://localhost:5173/**`
     - Your production URL when you deploy
3. Click **"Save"**

### 7. Test Your Setup

1. Make sure your `.env` file has the correct credentials
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Try the following:
   - ✅ Sign in with GitHub
   - ✅ Create a community
   - ✅ Create a post with an image
   - ✅ Like/dislike a post
   - ✅ Add a comment

## Troubleshooting

### GitHub Login Not Working
- Verify the callback URL in GitHub matches the one in Supabase
- Check that GitHub provider is enabled in Supabase
- Make sure your site URL is added to the redirect URLs
- Check browser console for errors

### Images Not Uploading
- Verify the `post-images` bucket exists and is public
- Check that storage policies are correctly set
- Ensure you're authenticated when uploading

### Database Errors
- Run the SQL schema again if tables are missing
- Check the Supabase logs in **Database** > **Logs**
- Verify RLS policies are enabled

### Environment Variables Not Loading
- Restart your dev server after changing `.env`
- Make sure the file is named exactly `.env` (not `.env.txt`)
- Verify the variable names start with `VITE_`

## Production Deployment

When deploying to production:

1. Update your `.env` file with production values
2. Add your production URL to:
   - GitHub OAuth app settings
   - Supabase URL Configuration
3. Update the `redirectTo` in `AuthContext.tsx` if needed
4. Enable additional security features in Supabase (rate limiting, etc.)

## Database Backup

To backup your data:
1. Go to **Database** > **Backups** in Supabase
2. Enable automatic backups (recommended)
3. You can also manually export data using the SQL editor

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- GitHub OAuth Guide: https://docs.github.com/en/developers/apps/building-oauth-apps
- Supabase Discord: https://discord.supabase.com
