# Fix Image Upload Issue

## Problem
Images are not uploading to the `post-images` bucket because storage policies are missing.

## Solution

### Option 1: Run the Storage Policies SQL (Recommended)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `storage-policies.sql`
4. Click **Run** to execute the SQL

### Option 2: Add to Main Schema

If you haven't run the schema yet, the updated `supabase-schema.sql` now includes storage policies. Just run the entire schema file.

### Option 3: Add Policies Manually via UI

1. Go to **Storage** in Supabase
2. Click on the `post-images` bucket
3. Go to **Policies** tab
4. Add the following policies:

#### Policy 1: Public Read Access
- **Policy Name**: Public Access for Images
- **Allowed Operation**: SELECT
- **Target Roles**: public
- **USING expression**: `bucket_id = 'post-images'`

#### Policy 2: Authenticated Upload
- **Policy Name**: Authenticated users can upload images
- **Allowed Operation**: INSERT
- **Target Roles**: authenticated
- **WITH CHECK expression**: `bucket_id = 'post-images'`

#### Policy 3: Authenticated Update
- **Policy Name**: Authenticated users can update images
- **Allowed Operation**: UPDATE
- **Target Roles**: authenticated
- **USING expression**: `bucket_id = 'post-images'`

#### Policy 4: Authenticated Delete
- **Policy Name**: Authenticated users can delete images
- **Allowed Operation**: DELETE
- **Target Roles**: authenticated
- **USING expression**: `bucket_id = 'post-images'`

## Verify the Fix

After applying the policies:

1. Make sure you're logged in (GitHub OAuth)
2. Try creating a post with an image
3. The image should upload successfully to the bucket

## Why This Happens

Supabase Storage has Row Level Security (RLS) enabled by default. Even though the bucket is marked as "public", you still need policies to:
- Allow authenticated users to **upload** files
- Allow everyone to **read/view** files
- Allow authenticated users to **update/delete** their files

Without these policies, all upload attempts will be rejected.
