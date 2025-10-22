-- VibeHub Social Forum Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Communities Table
CREATE TABLE IF NOT EXISTS communities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  user_name TEXT,
  avatar_url TEXT,
  community_id BIGINT REFERENCES communities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes Table
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INTEGER NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_post_id ON votes(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- ============================================
-- 3. CREATE RPC FUNCTION FOR POSTS WITH COUNTS
-- ============================================

CREATE OR REPLACE FUNCTION get_posts_with_counts()
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  content TEXT,
  image_url TEXT,
  user_name TEXT,
  avatar_url TEXT,
  community_id BIGINT,
  created_at TIMESTAMPTZ,
  like_count BIGINT,
  comment_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.image_url,
    p.user_name,
    p.avatar_url,
    p.community_id,
    p.created_at,
    COALESCE(COUNT(DISTINCT v.id) FILTER (WHERE v.vote = 1), 0) AS like_count,
    COALESCE(COUNT(DISTINCT c.id), 0) AS comment_count
  FROM posts p
  LEFT JOIN votes v ON p.id = v.post_id
  LEFT JOIN comments c ON p.id = c.post_id
  GROUP BY p.id, p.title, p.content, p.image_url, p.user_name, p.avatar_url, p.community_id, p.created_at
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE RLS POLICIES
-- ============================================

-- Communities Policies
CREATE POLICY "Communities are viewable by everyone" 
  ON communities FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create communities" 
  ON communities FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Posts Policies
CREATE POLICY "Posts are viewable by everyone" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON posts FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Users can update their own posts" 
  ON posts FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can delete their own posts" 
  ON posts FOR DELETE 
  TO authenticated 
  USING (true);

-- Votes Policies
CREATE POLICY "Votes are viewable by everyone" 
  ON votes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create votes" 
  ON votes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
  ON votes FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
  ON votes FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Comments Policies
CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Create a storage bucket named 'post-images' in Supabase Storage
-- 2. Set the bucket to public
-- 3. Enable GitHub OAuth in Authentication > Providers
-- 4. Add your site URL to Authentication > URL Configuration
