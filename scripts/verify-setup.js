#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env') });

const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

let hasErrors = false;

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
  hasErrors = true;
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

async function verifySetup() {
  console.log('\n🔍 Verifying VibeHub Setup...\n');

  // Check .env file exists
  const envPath = join(__dirname, '..', '.env');
  if (!existsSync(envPath)) {
    logError('.env file not found');
    logInfo('Create a .env file in the root directory with your Supabase credentials');
    process.exit(1);
  }
  logSuccess('.env file exists');

  // Check environment variables
  const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    missingVars.forEach(varName => {
      logError(`Missing environment variable: ${varName}`);
    });
    logInfo('Add the missing variables to your .env file');
    process.exit(1);
  }
  logSuccess('All required environment variables are set');

  // Validate Supabase URL format
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    logError('Invalid VITE_SUPABASE_URL format');
    logInfo('URL should be like: https://your-project.supabase.co');
    process.exit(1);
  }
  logSuccess('Supabase URL format is valid');

  // Initialize Supabase client
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  // Test database connection
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      logError(`Database connection failed: ${error.message}`);
      logInfo('Make sure you have run the database schema from supabase-schema.sql');
    } else {
      logSuccess('Database connection successful');
      logSuccess('profiles table exists');
    }
  } catch (err) {
    logError(`Database test failed: ${err.message}`);
  }

  // Check for other required tables
  const requiredTables = ['posts', 'comments', 'likes', 'follows'];
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        logError(`Table '${table}' not found or inaccessible`);
      } else {
        logSuccess(`${table} table exists`);
      }
    } catch (err) {
      logError(`Failed to check ${table} table: ${err.message}`);
    }
  }

  // Check storage bucket
  try {
    // Try to list files in the bucket (works even if empty)
    const { data, error } = await supabase.storage.from('post-images').list();
    
    if (error) {
      // Check if it's a "not found" error vs other errors
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        logError('post-images storage bucket not found');
        logInfo('Create a public bucket named "post-images" in Supabase Storage');
      } else {
        logWarning(`Storage bucket check: ${error.message}`);
        logInfo('Bucket might exist but there may be a permissions issue');
      }
    } else {
      logSuccess('post-images storage bucket exists and is accessible');
      
      // Try to verify it's public by checking bucket details
      const { data: buckets } = await supabase.storage.listBuckets();
      if (buckets) {
        const bucket = buckets.find(b => b.name === 'post-images');
        if (bucket?.public) {
          logSuccess('post-images bucket is public');
        } else if (bucket) {
          logWarning('post-images bucket exists but may not be public');
        }
      }
    }
  } catch (err) {
    logError(`Storage check failed: ${err.message}`);
  }

  // Check GitHub OAuth configuration
  logInfo('\nManual checks required:');
  logInfo('- [ ] GitHub OAuth is enabled in Supabase Authentication > Providers');
  logInfo('- [ ] Site URLs are configured: http://localhost:5173 and http://localhost:5173/**');

  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('\n❌ Setup verification failed. Please fix the errors above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ Setup verification passed! You\'re ready to start development.\n');
    console.log('Run: npm run dev\n');
    process.exit(0);
  }
}

verifySetup().catch(err => {
  console.error('\n❌ Verification script failed:', err.message);
  process.exit(1);
});
