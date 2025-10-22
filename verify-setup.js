// Verification script to check Supabase setup
// Run with: node verify-setup.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Verifying Supabase Setup...\n');

// Check environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySetup() {
  try {
    // Test 1: Check communities table
    console.log('\n📋 Testing database tables...');
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('count');
    
    if (communitiesError) {
      console.error('❌ Communities table error:', communitiesError.message);
    } else {
      console.log('✅ Communities table accessible');
    }

    // Test 2: Check posts table
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('count');
    
    if (postsError) {
      console.error('❌ Posts table error:', postsError.message);
    } else {
      console.log('✅ Posts table accessible');
    }

    // Test 3: Check votes table
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('count');
    
    if (votesError) {
      console.error('❌ Votes table error:', votesError.message);
    } else {
      console.log('✅ Votes table accessible');
    }

    // Test 4: Check comments table
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('count');
    
    if (commentsError) {
      console.error('❌ Comments table error:', commentsError.message);
    } else {
      console.log('✅ Comments table accessible');
    }

    // Test 5: Check RPC function
    console.log('\n⚙️  Testing RPC function...');
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_posts_with_counts');
    
    if (rpcError) {
      console.error('❌ RPC function error:', rpcError.message);
    } else {
      console.log('✅ get_posts_with_counts function working');
    }

    // Test 6: Check storage bucket
    console.log('\n📦 Testing storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('❌ Storage error:', bucketsError.message);
    } else {
      const postImagesBucket = buckets.find(b => b.name === 'post-images');
      if (postImagesBucket) {
        console.log('✅ post-images bucket exists');
        console.log(`   Public: ${postImagesBucket.public}`);
      } else {
        console.error('❌ post-images bucket not found');
        console.log('   Please create it in Supabase Dashboard > Storage');
      }
    }

    // Test 7: Check auth providers
    console.log('\n🔐 Checking authentication...');
    console.log('   Note: GitHub OAuth can only be fully tested in the browser');
    console.log('   Make sure to enable it in: Authentication > Providers > GitHub');

    console.log('\n✨ Setup verification complete!\n');
    console.log('Next steps:');
    console.log('1. If any tests failed, check SUPABASE_SETUP.md');
    console.log('2. Enable GitHub OAuth in Supabase Dashboard');
    console.log('3. Run: npm run dev');
    console.log('4. Test login and features in the browser\n');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

verifySetup();
